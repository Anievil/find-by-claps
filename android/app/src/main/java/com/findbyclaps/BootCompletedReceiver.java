package com.findbyclaps;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

public class BootCompletedReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(Context context, Intent intent) {
        System.out.println("*** Broadcast Ricevuto ***");
        context.startService(new Intent(context, VibrationModes.class));
    }
}