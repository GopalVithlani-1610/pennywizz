import React from 'react';
import {StyleSheet, View} from 'react-native';
import {
  CaptionText,
  PressableTextButton,
  useToastContext,
} from '@/app/components';
import {CommonOperations} from '@/src/database';
import {COLORS, SPACING} from '@/app/theme';
import CodePush from 'react-native-code-push';
import AnalyticsManager from '@/src/app/services/AnalyticsManager';

export default () => {
  const toast = useToastContext();
  const reset = async () => {
    AnalyticsManager.remoteLog('Reseted Database');
    CommonOperations.resetDatabase(() => {
      toast.show(
        'Database has been reset making it a fresh start :). App will be reloaded',
        'Success',
      );
      setTimeout(() => {
        CodePush.restartApp();
      }, 1000);
    });
  };
  return (
    <View style={{marginHorizontal: SPACING.md}}>
      <CaptionText>
        ⚠️This is irreversible action. This will delete all the data from the
        database making it fresh to start
      </CaptionText>
      <PressableTextButton
        textStyle={styles.deleteButtonTextStyle}
        text="Make a fresh start"
        onPress={reset}
        style={styles.buttonStyle}
        textType="subheading"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    padding: SPACING.md,
    borderRadius: 8,
    marginTop: 20,
    backgroundColor: COLORS.lightGreen,
  },
  deleteButtonTextStyle: {
    color: COLORS.greenReport,
    fontSize: 18,
    textAlign: 'center',
  },
});
