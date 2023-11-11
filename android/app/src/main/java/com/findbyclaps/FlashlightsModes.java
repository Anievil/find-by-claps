package com.findbyclaps;

import android.content.Context;

import android.hardware.Camera;
import android.hardware.camera2.CameraManager;
import android.os.Build;
import android.os.Handler;

import com.facebook.react.bridge.ReactApplicationContext;

public class FlashlightsModes {
    private Boolean isTorch = true;
    public ReactApplicationContext myReactContext;

    public String mode;

    public void setMode(String mod) {
        mode = mod;
    }
    public int timeoutTime() {
        switch (mode){

            case "disco":
                return 100;

            case "sos":
                return 12000;

            default:
                return 500;
        }
    }
    public void setReactApplicationContext(ReactApplicationContext context) {
        myReactContext = context;
    }

    private Camera camera;
    private Boolean isTorchOn = false;

    Handler handler = new Handler();
    public void defaultFlash() {
        switchState(isTorch);
        isTorch = !isTorch;
    }
    public void sosFlash() {
        switchState(true);
        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                switchState(false);
            }
        }, 500);

        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                switchState(true);
            }
        }, 1000);
        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                switchState(false);
            }
        }, 1500);

        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                switchState(true);
            }
        }, 2000);
        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                switchState(false);
            }
        }, 2500);

        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                switchState(true);
            }
        }, 3000);
        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                switchState(false);
            }
        }, 4500);

        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                switchState(true);
            }
        }, 6000);
        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                switchState(false);
            }
        }, 7500);

        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                switchState(true);
            }
        }, 9000);
        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                switchState(false);
            }
        }, 10500);
    }
    Runnable runnableFlash = new Runnable() {

        @Override
        public void run() {
            try{
                switch (mode){
                    case "sos":
                        sosFlash();
                        break;

                    default:
                        defaultFlash();
                        break;
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
    public void switchState(Boolean newState) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            CameraManager cameraManager =
                    (CameraManager) myReactContext.getSystemService(Context.CAMERA_SERVICE);

            try {
                String cameraId = cameraManager.getCameraIdList()[0];
                cameraManager.setTorchMode(cameraId, newState);
            } catch (Exception e) {
                String errorMessage = e.getMessage();
            }
        } else {
            Camera.Parameters params;

            if (newState && !isTorchOn) {
                camera = Camera.open();
                params = camera.getParameters();
                params.setFlashMode(Camera.Parameters.FLASH_MODE_TORCH);
                camera.setParameters(params);
                camera.startPreview();
                isTorchOn = true;
            } else if (isTorchOn) {
                params = camera.getParameters();
                params.setFlashMode(Camera.Parameters.FLASH_MODE_OFF);

                camera.setParameters(params);
                camera.stopPreview();
                camera.release();
                isTorchOn = false;
            }
        }
    }


}
