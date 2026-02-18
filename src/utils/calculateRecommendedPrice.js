export const calculateRecommendedPrice = ({
  originalPrice,
  shippingCost,
  exchangeRate,
  participants,
  feeRate,
  domesticShipping
}) => {
  if (!originalPrice || !shippingCost || !exchangeRate || !participants) {
    return 0;
  }

  const productKRW = originalPrice * exchangeRate;
  const shippingKRW = (shippingCost * exchangeRate) / participants;
  const feeMultiplier = 1 + feeRate / 100;

  return Math.round(
    (productKRW + shippingKRW) * feeMultiplier +
    Number(domesticShipping || 0)
  );
};
