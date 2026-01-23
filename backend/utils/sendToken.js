export const issueAuthToken = (user, res, status) => {
  const jwtToken = user.getJWTToken();

  res
    .status(status)
    .cookie("token", jwtToken, {
      httpOnly: true,
      expires: new Date(
        Date.now() +
          Number(process.env.COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000
      ),
    })
    .json({
      success: true,
      token: jwtToken,
      user,
    });
};
