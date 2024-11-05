const formatNumber = function (num) {
  const truncateToOneDecimal = (n) => {
    return Math.floor(n * 10) / 10;
  };

  if (num >= 1_000_000) {
    return truncateToOneDecimal(num / 1_000_000) + "m";
  } else if (num >= 1_000) {
    return truncateToOneDecimal(num / 1_000) + "k";
  } else {
    return num?.toString();
  }
};

export default formatNumber;
