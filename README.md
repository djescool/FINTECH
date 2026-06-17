# FINTECH - Native Android Wrapper

This repository contains the source code for the Android Native wrapper for the FINTECH application. The web interfaces (HTML/CSS/JS) have been embedded inside a highly optimized Android `WebView`.

## Features
- **120fps Hardware Acceleration:** Optimized for high refresh rate screens like POCO X8 Pro Max.
- **Pure AMOLED Black:** Edge-to-edge support with a transparent system UI and true black background.
- **Native Haptics:** The interface utilizes Android's native haptic engine when clicking elements.
- **Local Notifications:** Web interface can dispatch native Android reminders.
- **Offline Ready:** The entire app runs locally from the APK assets.
- **Dark Mode Support:** A floating button allows toggling between Light and Dark mode of the interfaces.

## Project Structure
- `app/src/main/assets/www/`: Contains all the HTML, CSS, and JS files. The original `.txt` files have been renamed to `.html` and modified to run natively.
- `app/src/main/java/com/bolivianus/app/MainActivity.kt`: The main entry point for the Android Application configuring the WebView.
- `app/src/main/java/com/bolivianus/app/WebAppInterface.kt`: The bridge between JavaScript and Native Android (Haptics & Notifications).

## How to Build the APK
You can build the APK directly from the command line using Gradle, or by opening the project in Android Studio.

### Using Command Line
1. Open a terminal in the root of the project.
2. Run the following command:
   ```bash
   ./gradlew assembleDebug
   ```
3. The APK will be generated at: `app/build/outputs/apk/debug/app-debug.apk`

### Using Android Studio
1. Open Android Studio.
2. Select **Open an existing Project**.
3. Choose the root directory of this repository.
4. Let Gradle sync.
5. Click the **Run** button or go to **Build > Build Bundle(s) / APK(s) > Build APK(s)**.

## How to Modify the Web Files
If you wish to change the interface or the logic of the web files:
1. Navigate to `app/src/main/assets/www/`.
2. Edit the respective `.html` file.
3. If you want to use the native Android features (like Haptics), ensure elements have `onclick` attributes or are clickable, and the injected `script.js` will automatically hook into them.
4. After making changes, rebuild the APK.

## Architecture & Optimizations
- **Edge-to-Edge:** Handled natively using Android `WindowInsetsController`.
- **Zoom & Scrollbars:** Disabled natively to emulate a 100% native feel.
- **Permissions:** Internet, Vibrator, and Post Notifications.

*Built for BolivianUS*
