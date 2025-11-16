package com.demo.demo;

import static android.content.Intent.FLAG_ACTIVITY_NEW_TASK;

import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.ReactApplication;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class CustomNativeModule extends ReactContextBaseJavaModule {
    public static ReactApplicationContext mContext;

    CustomNativeModule(ReactApplicationContext context) {
        super(context);
        mContext = context;
    }

    @ReactMethod
    public void getAppVersion(Callback callback) {

        try {
            PackageInfo packageInfo = mContext.getPackageManager().getPackageInfo(mContext.getPackageName(), 0);
            callback.invoke(packageInfo.versionName);
        } catch (Exception e) {
            callback.invoke("");
        }
    }

    @ReactMethod
    public void reloadApp(){
        ReactApplication reactApplication = (ReactApplication) mContext.getCurrentActivity().getApplication();
        reactApplication.getReactNativeHost().getReactInstanceManager().recreateReactContextInBackground();
    }

    @Override
    public String getName() {
        return "CustomNativeModule";
    }

}
