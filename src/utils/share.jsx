export const shareOnTwitter = () => {
  const message = "I love reading the bible with this new app!";
  const hashtags = "lightway,bible";
  const shareLink = `https://twitter.com/intent/tweet?text=${message}&hashtags=${hashtags}`;
  window.open(shareLink, "_blank");
};

export const shareOnFacebook = () => {
  const hashtag = "#bible";
  const lightwayLink = "https://lightway.vercel.app/";
  const appId = 442448267408277;
  console.log(appId);
  const shareLink = `https://www.facebook.com/dialog/share?app_id=${appId}&href=${lightwayLink}&hashtag=${hashtag}`;
  window.open(shareLink, "_blank");
};

export const shareOnInstagram = () => {
  const shareLink = "https://www.instagram.com/p/CfhJi-3L1dX/";
  window.open(shareLink, "_blank");
};
