package com.findbyclaps;

import android.app.IntentService;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.os.VibratorManager;


import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;

public class VibrationModes extends Service {
    Vibrator vibrator;
    VibratorManager vibratorManager;

    public String mode;

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
    @Override
    public void onCreate() {
        super.onCreate();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            vibratorManager = (VibratorManager) getSystemService(Context.VIBRATOR_MANAGER_SERVICE);
            vibrator = vibratorManager.getDefaultVibrator();
        }
    }
    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Notification.Builder builder = null;
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            NotificationChannel serviceChannel = new NotificationChannel(
                    "ForegroundServiceChannel",
                    "Foreground Service Channel",
                    NotificationManager.IMPORTANCE_DEFAULT
            );
            NotificationManager manager = getSystemService(NotificationManager.class);
            manager.createNotificationChannel(serviceChannel);
            builder = new Notification.Builder(this, "ForegroundServiceChannel")
                    .setContentTitle(getString(R.string.app_name))
                    .setContentText("Text")
                    .setAutoCancel(true);
        }

        Notification notification = builder.build();

        startForeground(1, notification);
        String VibroMode = intent.getStringExtra("VibroMode");
        String isClose = intent.getStringExtra("isClose");
        mode = VibroMode;
        if (isClose.equals("true")) {
            handler.removeCallbacksAndMessages(null);
            stopForeground(true);
            stopService(intent);
        } else if (isClose.equals("false")) {
            handler.post(runnableVibro);
        }
        return super.onStartCommand(intent, flags, startId);
    }

    public int timeoutTime() {
        switch (mode){
            case "default":
                return 1000;

            default:
                return 1500;
        }
    }
    Handler handler = new Handler();

    public void defaultVibration() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            vibrator.vibrate(VibrationEffect.createOneShot(500, VibrationEffect.DEFAULT_AMPLITUDE));
        } else {
            vibrator.vibrate(500);
        }
    }

    public void strongVibration() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            vibrator.vibrate(VibrationEffect.createOneShot(900, VibrationEffect.DEFAULT_AMPLITUDE));
        } else {
            vibrator.vibrate(900);
        }
    }
    public void heartbeatVibration() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            vibrator.vibrate(VibrationEffect.createOneShot(200, VibrationEffect.DEFAULT_AMPLITUDE));
            handler.postDelayed(new Runnable() {
                @Override
                public void run() {
                    vibrator.vibrate(VibrationEffect.createOneShot(200, VibrationEffect.DEFAULT_AMPLITUDE));
                }
            }, 400);
        } else {
            vibrator.vibrate(200);
            handler.postDelayed(new Runnable() {
                @Override
                public void run() {
                    vibrator.vibrate(200);
                }
            }, 400);
        }
    }
    public void tickTockVibration() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            vibrator.vibrate(VibrationEffect.createOneShot(200, VibrationEffect.DEFAULT_AMPLITUDE));
            handler.postDelayed(new Runnable() {
                @Override
                public void run() {
                    vibrator.vibrate(VibrationEffect.createOneShot(600, VibrationEffect.DEFAULT_AMPLITUDE));
                }
            }, 500);
        } else {
            vibrator.vibrate(200);
            handler.postDelayed(new Runnable() {
                @Override
                public void run() {
                    vibrator.vibrate(600);
                }
            }, 500);
        }
    }
    Runnable runnableVibro = new Runnable() {

        @Override
            public void run() {
                try{
                    switch (mode){

                        case "strongVibration":
                            strongVibration();

                        case "heartbeat":
                            heartbeatVibration();

                        case "tickTock":
                            tickTockVibration();

                        default:
                            defaultVibration();
                    }
                }
                catch (Exception e) {
                    // TODO: handle exception
                }
                finally{
                    //also call the same runnable to call it at regular interval
                    handler.postDelayed(this, timeoutTime());
                }
            }
    };
}
