# General ProGuard optimizations
-optimizationpasses 5
-dontusemixedcaseclassnames
-dontskipnonpubliclibraryclasses
-keepattributes *Annotation*

# WebView with JS interface
-keepclassmembers class fqcn.of.javascript.interface.for.webview {
   public *;
}

# Preserve application entry points
-keep public class * extends android.app.Application {
   public void onCreate();
}

# Preserve activities, fragments, services, and broadcast receivers
-keep public class * extends android.app.Activity
-keep public class * extends android.app.Service
-keep public class * extends android.content.BroadcastReceiver
-keep public class * extends android.content.ContentProvider
-keep public class * extends androidx.fragment.app.Fragment

# Preserve Tauri-generated JNI methods
-keepclasseswithmembernames class * {
    native <methods>;
}

# Keep Tauri-related classes and metadata
-keep class app.tauri.** { *; }
-keepattributes InnerClasses, EnclosingMethod

# Remove unused code and libraries
-dontnote
-dontwarn javax.annotation.**
-dontwarn kotlinx.coroutines.**
-dontwarn kotlin.reflect.jvm.**
-dontwarn com.google.**

# Optimize line number mappings (if debugging isn't required)
-renamesourcefileattribute SourceFile
-keepattributes SourceFile, LineNumberTable

# Enable shrinking of unused resources (pair with shrinkResources = true in build.gradle)
# Ensure WebView support isn't stripped
-keep class android.webkit.WebView { *; }
-keep public class * extends android.webkit.WebView

# Strip unused logging (optional for size reduction)
-assumenosideeffects class android.util.Log {
    public static int v(...);
    public static int d(...);
    public static int i(...);
    public static int w(...);
    public static int e(...);
}

# Optimize code further (use cautiously for better APK size)
-repackageclasses ''
-flattenpackagehierarchy
-allowaccessmodification
-mergeinterfacesaggressively