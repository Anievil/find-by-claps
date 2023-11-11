package com.findbyclaps;

import android.app.Notification;
import android.content.Context;

import android.content.Intent;
import android.hardware.Camera;
import android.hardware.camera2.CameraAccessException;
import android.hardware.camera2.CameraManager;
import android.media.MediaRecorder;
import android.os.AsyncTask;
import android.os.Build;
import android.os.Debug;
import android.os.Handler;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.os.VibratorManager;
import android.util.Log;

import java.io.IOException;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class ClapDetectorModule extends ReactContextBaseJavaModule {
    public final ReactApplicationContext myReactContext;

    ClapDetectorModule(ReactApplicationContext context) {
        super(context);
        this.myReactContext = context;
    }
    LongOperation recordAudioSync = null;

    @Override
    public String getName() {
        return "ClapDetectorModule";
    }
    Boolean isDecline;

    @ReactMethod
    public void Ewe(boolean IsTorchAccess, boolean IsVibroAccess, String flashMode, String vibroMode, double sensetive, Callback callBack){
        isDecline = false;
        recordAudioSync = new LongOperation();
        recordAudioSync.setSensetive(sensetive);
        recordAudioSync.setPromise(callBack);
        recordAudioSync.setFlashAndVibroData(flashMode, vibroMode);
        recordAudioSync.setIsVibroAccess(IsVibroAccess);
        recordAudioSync.setIsTorchAccess(IsTorchAccess);
        recordAudioSync.execute("");
    }

    @ReactMethod
    public void declineDetecting(){
        isDecline = true;
        if(recordAudioSync != null){
            recordAudioSync.dicline();
        }
    }


    private class LongOperation extends AsyncTask<String, Void, String> {

        MediaRecorder recorder;
        int clapDetectedNumber;
        Callback promise;
        FlashlightsModes flash = new FlashlightsModes();
        public String vibroMode;
        boolean IsVibroAccess;
        Intent mIntent = new Intent(myReactContext, VibrationModes.class);
        double sensetive;
        boolean IsTorchAccess;

        public void setFlashAndVibroData(String flashMode, String vibroMod) {
            flash.setReactApplicationContext(myReactContext);
//            vibration.setReactApplicationContext(myReactContext);
            flash.setMode(flashMode);
            vibroMode = vibroMod;
        }
        public void setIsTorchAccess(boolean torch) { IsTorchAccess = torch; }

        public void setPromise(Callback promis) { promise = promis; }
        public void setSensetive(double sensetiv) { sensetive = sensetiv; }
        public void setIsVibroAccess(boolean vibro) { IsVibroAccess = vibro; }

        @Override
        protected String doInBackground(String... strings) {
            recordAudio();
            return "" + clapDetectedNumber;
        }

        private void recordAudio() {
            recorder = new MediaRecorder();
            recorder.setAudioSource(MediaRecorder.AudioSource.MIC);
            recorder.setOutputFormat(MediaRecorder.OutputFormat.THREE_GPP);
            recorder.setAudioEncoder(MediaRecorder.AudioEncoder.AMR_NB);
            recorder.setOutputFile("/data/data/" + getReactApplicationContext().getPackageName() + "/music.3gp");
            int startAmplitude = 0;
            int finishAmplitude;
            double additionalAmplitude = -(sensetive - 1) * 8000;
            int amplitudeThreshold = (int) (19000 +  Math.ceil(additionalAmplitude));
            Log.d("react native uwu", amplitudeThreshold + "");

            int counterMax = 1;
            try {
                recorder.prepare();
                recorder.start();
                startAmplitude = recorder.getMaxAmplitude();
            } catch (IOException e) {
                e.printStackTrace();
            }

            do {
                waitSome();
                finishAmplitude = recorder.getMaxAmplitude();
                if (finishAmplitude >= amplitudeThreshold) {
                    clapDetectedNumber++;
                    if(IsTorchAccess){
                        flash.handler.post(flash.runnableFlash);
                    }
                    if(IsVibroAccess){
                          if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                              mIntent.putExtra("VibroMode", vibroMode);
                              mIntent.putExtra("isClose", "false");
                              myReactContext.startForegroundService(mIntent);
                          }

                    }
                    promise.invoke("uwu");
                }
            }while(counterMax > clapDetectedNumber && !isDecline);

            done();
        }

        private void done() {
            if (recorder != null) {
                recorder.stop();
                recorder.release();
            }
        }

        public void dicline() {
            flash.handler.removeCallbacksAndMessages(null);
             if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                 mIntent.putExtra("isClose", "true");
                 myReactContext.startForegroundService(mIntent);
             }
        }

        private void waitSome() {
            try {
                Thread.sleep(250);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}