import React, {useEffect, useState} from 'react';
import {SafeAreaView, Text, View, AppState} from 'react-native';
import codePush from 'react-native-code-push';

const App = () => {
  const [modalState, setModalState] = useState(false);
  const [ps, setPs] = useState(0);

  const codePushSync = () => {
    codePush.sync(
      {
        updateDialog: {
          title: '새로운 업데이트가 존재합니다.',
          optionalUpdateMessage: '지금 업데이트하시겠습니까?',
          optionalIgnoreButtonLabel: '나중에',
          optionalInstallButtonLabel: '업데이트',
          mandatoryContinueButtonLabel: 'Update',
          mandatoryUpdateMessage: '',
        },
        installMode: codePush.InstallMode.IMMEDIATE, //즉시 업데이트
      },
      status => {
        switch (status) {
          case codePush.SyncStatus.DOWNLOADING_PACKAGE:
            console.log(status);
            setModalState(true);
            // Show "downloading" modal
            break;
          case codePush.SyncStatus.INSTALLING_UPDATE:
            // Hide "downloading" modal
            setModalState(false);
            break;
        }
      },
      ({receivedBytes, totalBytes}) => {
        /* Update download modal progress */
        console.log('%%%%%', (receivedBytes / totalBytes) * 100 + '%');
        setPs(Math.floor((receivedBytes / totalBytes) * 100));
      },
    );
  };
  useEffect(() => {
    codePushSync();
    AppState.addEventListener('change', (state: string) => {
      state === 'active' && codePushSync();
    });
  }, []);
  return (
    <SafeAreaView>
      <View>
        <Text>codePush s{ps}%</Text>
        {modalState && (
          <Text style={{fontSize: 25}}>업데이트중입니다!!!!!!{ps}%</Text>
        )}
        <Text></Text>
      </View>
    </SafeAreaView>
  );
};

export default App;
