package com.projectnow;

import android.app.Application;
import android.util.Log;

import com.RNFetchBlob.RNFetchBlobPackage;
import com.imagepicker.ImagePickerPackage;
import com.facebook.react.ReactApplication;
import com.calendarevents.CalendarEventsPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import cl.json.RNSharePackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.chirag.RNMail.*;
import io.fullstack.oauth.OAuthManagerPackage;
import com.xxsnakerxx.socialauth.SocialAuthPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    protected boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new CalendarEventsPackage(),
            new PickerPackage(),
            new RNSharePackage(),
            new MapsPackage(),
            new OAuthManagerPackage(),
            new SocialAuthPackage(),
            new LinearGradientPackage(),
            new MapsPackage(),
            new LinearGradientPackage(),
            new ImagePickerPackage(),
            new RNFetchBlobPackage(),
            new RNMail()
      );
    }
  };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
      super.onCreate();
    }
}
