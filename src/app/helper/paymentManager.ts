import Qonversion, {
  Automations,
  Entitlement,
  LaunchMode,
  Product,
  QonversionConfigBuilder,
  UserPropertyKey,
} from 'react-native-qonversion';
import {Keys} from '@/app/config';
import Utils from '@/app/utils';
import {captureException} from '@sentry/react-native';

//TODO: Have to implement subscriptions model. full
/**
 * @description Manager for handling the InApp Purchase.
 */
class PaymentManager {
  isPaymentActive = true;

  launchQonversionSDK(userIdentifier: string) {
    if (!this.isPaymentActive) {
      return;
    }
    try {
      this.ensureInitialized();
      Qonversion.getSharedInstance().setUserProperty(
        UserPropertyKey.CUSTOM_USER_ID,
        userIdentifier,
      );
    } catch (err) {
      captureException(err, {
        data: 'fn:launchQonversionSDK',
      });
    }
  }
  ensureInitialized() {
    Qonversion.initialize(
      new QonversionConfigBuilder(
        Keys.PURCHASE_KEY,
        LaunchMode.SUBSCRIPTION_MANAGEMENT,
      ).build(),
    );
  }
  /**
   * @description Check for the active purchase user have made.
   * @returns Permission Object if user have purchased.
   */

  async getActivePermission() {
    try {
      const permissions =
        await Qonversion.getSharedInstance().checkEntitlements();
      return permissions.size > 1;
      // const premiumPermission = permissions.get(this.permissionId);
      // return premiumPermission && premiumPermission.isActive;
    } catch (err) {
      //Utils.makeToast('Error while getting your purchase status', 'LONG');
      return false;
    }
  }
  /**
   * @description Get offerings to display from qonversion.
   */
  async getOfferings() {
    try {
      this.ensureInitialized();
      const offerings = await Qonversion.getSharedInstance().offerings();
      if (
        offerings != null &&
        offerings.main != null &&
        offerings.main.products.length > 0
      ) {
        return offerings.main.products;
      }
    } catch (error: any) {
      console.log(error.code, error.message);
      Utils.makeToast(
        'Failed to get product for purchase ' + error.message,
        'SHORT',
      );
      return null;
    }
  }
  /**
   * @description Make payment
   * @param qonversionOfferingId Id of the offering to purchase.
   */
  async makePayment(product: Product | undefined) {
    if (!product) {
      return;
    }
    try {
      const purchase = await Qonversion.getSharedInstance().purchase(
        product.toPurchaseModel(),
      );
      if (this.isActiveSubscription(purchase)) {
        Utils.makeAlert('Success', 'Successfully purchased');
      }
    } catch (error: any) {
      if (!error.userCanceled) {
        Utils.makeAlert('Error', error.message || 'Something went wrong');
      }
    }
  }
  /**
   * @description Restore the user purchased.
   */
  async restorePurchase() {
    if (!this.isPaymentActive) {
      return;
    }
    try {
      // this.ensureInitialized();
      const permission = await Qonversion.getSharedInstance().restore();
      if (this.isActiveSubscription(permission)) {
        Utils.makeAlert('Success', 'Successfully restored the purchase');
        return;
      }
      Utils.makeAlert('Not found', 'No purchase found.');
    } catch (error: any) {
      Utils.makeAlert('Error', error.message);
    }
  }
  isActiveSubscription(purchase: Map<string, Entitlement>) {
    return purchase.get(this.permissionId)?.isActive || false;
  }

  /**
   * Displays the Qonversion paywall screen.
   *
   * The paywall screen is a predefined screen in the Qonversion dashboard that displays available products and offers.
   * This function is used to show the paywall screen to the user.
   *
   * @throws Will throw an error if the paywall screen cannot be displayed.
   *
   * @example
   *
   **/
  async showPaywall() {
    await Automations.getSharedInstance()
      .showScreen('7W-_i2PR')
      .catch(_ => {});
  }
}

export default new PaymentManager();
