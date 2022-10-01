# codePush

### React-Native + Typescript 프로젝트 생성

```bash
npx react-native init MyAwesomeProject --template react-native-template-typescript
```

* 참고 Microsoft React-Native Typescript starter 가이드

[https://github.com/Microsoft/TypeScript-React-Native-Starter](https://github.com/Microsoft/TypeScript-React-Native-Starter)

## 준비

```bash
yarn global add appcenter-cli
appcenter login
```

![cp1.png](./images/cp1.png)

- appcenter-cli를 설치한 후에 appcenter register 명령어를 터미널에 입력하면 appcenter사이트가 열리고 로그인이 된 상태라면 위 이미지처럼 토큰이 나타나게 됩니다. 이걸 복사해서 터미널에 붙여넣기 합니다.
    
    ![스크린샷 2021-11-29 오후 5.43.19.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/9aee2dd1-36b8-49c1-b9fd-39480c942ecc/스크린샷_2021-11-29_오후_5.43.19.png)
    
- 그리고 앱센터에서 android/ios 앱을 추가해줍니다.터미널에서 아래 명령어로 추가해 줄 수도 있습니다.

```bash
appcenter apps create -d {appName-android} -o Android -p React-Native
appcenter apps create -d {appName-ios} -o iOS -p React-Native
```

### codePush 모듈 설치

```bash
yarn add react-native-code-push
yarn add appcenter appcenter-analytics appcenter-crashes --exact
cd ../ios
pod install --repo-update
```

## ios

- 앱센터에서 앱을 선택하면  Overview란 메뉴가 나오는데 여기서 설명한대로 셋팅하면 되지만 아래에 순서대로 설명하도록 하겠습니다.
    
    ![스크린샷 2021-11-30 오후 5.43.49.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/b2035bde-865d-4be0-906e-03f6bb9feecf/스크린샷_2021-11-30_오후_5.43.49.png)
    

1. AppCenter-Config.plist 파일을 추가해줍니다. 
- 파일안에 내용은 앱센터 Overview메뉴 Getting started 2번에 나와있습니다.
    
    ![스크린샷 2021-11-30 오후 5.46.31.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/485c8fdb-f6d7-4da7-90e4-917cb79519f9/스크린샷_2021-11-30_오후_5.46.31.png)
    
- AppCenter-Config.plist 파일 추가하는법
xcode에서 프로젝트폴더에서 우클릭 후 New File로 AppCenter-Config.plist파일을 추가해줍니다. 자세한 설명은 아래 사진으로 첨부하겠습니다.
    
    ![스크린샷 2021-11-30 오후 5.00.49.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/8598d630-c7bf-4e82-9ac4-73888dc50854/스크린샷_2021-11-30_오후_5.00.49.png)
    
    ![스크린샷 2021-11-30 오후 5.00.57.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/d663b885-d0f9-44bd-8ce4-6674f8d098d5/스크린샷_2021-11-30_오후_5.00.57.png)
    
    ![스크린샷 2021-11-30 오후 5.55.29.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/aab99bef-a23d-4680-8a09-218129649322/스크린샷_2021-11-30_오후_5.55.29.png)
    

1. **ios/{ProjectName}/`AppDelegate.m`** 파일에서 아래 모듈들을 **import** 시켜줍니다.

```objectivec
// #ifdef FB_SONARKIT_ENABLED 위에 추가해줍니다.
#import <CodePush/CodePush.h>
#import <AppCenterReactNative.h>
#import <AppCenterReactNativeAnalytics.h>
#import <AppCenterReactNativeCrashes.h>
```

1. `AppDelegate.m` 폴더에서 아래 코드를 수정해줍니다.

```objectivec
- return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
=>
+ return [CodePush bundleURL];
```

![스크린샷 2021-11-30 오후 5.09.04.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/af90c251-d393-4ffe-945c-1ebc2601add2/스크린샷_2021-11-30_오후_5.09.04.png)

1. 아래 코드를 `didFinishLaunchingWithOptions` 메서드에 추가합니다.

```objectivec
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
// ... 
	+ [AppCenterReactNative register];
	+ [AppCenterReactNativeAnalytics registerWithInitiallyEnabled:true];
	+ [AppCenterReactNativeCrashes registerWithAutomaticProcessing];
// ...
```

![스크린샷 2021-11-30 오후 5.27.15.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/e5517ee2-6e91-43cc-bc5a-d105a9a1f930/스크린샷_2021-11-30_오후_5.27.15.png)

1. **ios/{ProjectName}/info.plist** 파일에서 코드푸쉬 키를 추가해줍니다.

```
<key>CodePushDeploymentKey</key>
<string>{codepush key}</string>
```

- 코드푸쉬 production, staging 키 확인 방법
터미널에 appcenter codepush deployment list —app {owner}/{appName} -k 명령어를 입력하면 키가 나옵니다.
    
    ![스크린샷 2021-11-30 오후 5.03.38.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/499587e7-7416-4a93-8fb2-0a531dea83d5/스크린샷_2021-11-30_오후_5.03.38.png)
    
- {owner}/{appName}을 모르겠으면 appcenter apps list 명령어를 입력하면 앱센터에 등록된 앱리스트가 나오게 됩니다.

## Android

- 앱센터에서 android앱을 선택 후 Overview메뉴에서 Getting started 2번을 먼저 실행해줍니다.

1. **android/app/src/main/assets** 폴더에서 (assets폴더가 없으면 추가하면 됩니다.) 
appcenter-config.json파일을 추가후 아래 코드를 추가해줍니다.(앱센터 android앱 Overview메뉴 2번에 추가해야되는 코드가 있습니다.)
    
    ```json
    {
    	"app_secret":{app_secret_code}
    }
    ```
    
    **res/values/strings.xml** 파일에서 아래 코드 추가
    
    ```xml
    <string name="appCenterCrashes_whenToSendCrashes" moduleConfig="true" translatable="false">DO_NOT_ASK_JAVASCRIPT</string>
    <string name="appCenterAnalytics_whenToEnableAnalytics" moduleConfig="true" translatable="false">ALWAYS_SEND</string>
    ```
    
    ![스크린샷 2021-11-30 오후 7.05.23.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/1f129b79-f1a8-436e-b575-e0e89c3dce72/스크린샷_2021-11-30_오후_7.05.23.png)
    

1. **android/settings.gradle**에서 아래 코드 추가

```java
include ':app', ':react-native-code-push'
project(':react-native-code-push').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-code-push/android/app')
```

![스크린샷 2021-11-30 오후 6.37.49.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/08e3986a-c4f7-48bb-8354-c8aa42c5795f/스크린샷_2021-11-30_오후_6.37.49.png)

1. **android/app/build.gradle**에서 아래 코드 추가

```java
...
+ apply from: "../../node_modules/react-native/react.gradle"
+ apply from: "../../node_modules/react-native-code-push/android/codepush.gradle"
...
```

![스크린샷 2021-11-30 오후 6.37.05.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/f854150f-d210-4ea8-bc5e-c862a8388d0f/스크린샷_2021-11-30_오후_6.37.05.png)

1. **MainApplication.java**파일에서 아래 코드 추가 앞에 +가 붙은 코드만 넣으면 됩니다.

```java
...
+ import com.microsoft.codepush.react.CodePush;

public class MainApplication extends Application implements ReactApplication {
    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        ...
        + @Override
        + protected String getJSBundleFile() {
        +     return CodePush.getJSBundleFile();
        + }
    };
}
```

![스크린샷 2021-11-30 오후 6.49.42.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/9a87bb9d-71b4-48b9-a2cc-b6dab59f0255/스크린샷_2021-11-30_오후_6.49.42.png)

1. **strings.xml** 파일에 코드푸쉬 키를 추가해줍니다.

```xml
<string moduleConfig="true" name="CodePushDeploymentKey">{DeploymentKey}</string>
```

- ios와 마찬가지로 key를 확인하는 명령어를 터미널에 입력해서 key를 확인 합니다.
appcenter codepush deployment list —app {owner}/{appName} -k

## 배포

```bash
appcenter codepush release-react -a {owner}/{appName} -d {Production or Staging}
```

## **Plugin Usage**

```jsx
import codePush from 'react-native-code-push';

```
