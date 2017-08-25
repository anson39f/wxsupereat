# a takeaway demo of wxapp
微信小程序demo

private static final String BaseUrl = "http://food.oddappz.com/api/";
    private static final String NbtBaseUrl = "http://food.oddappz.com/api/";
    private static final String PayPalTokenUrl = "http://api.sandbox.paypal.com/v1/oauth2/";
    public static final String aboutUS_Url = "http://food.oddappz.com/mob-cms/about-us";
    private static DDProgressBarDialog ddProgressBarDialog = null;
    public static final String helpandSuppord_Url = "http://food.oddappz.com/mob-cms/faq";
    public static final String privacy_policy_Url = "http://food.oddappz.com/mob-cms/privacy-policy";
    public static final String term_condi_Url = "http://food.oddappz.com/mob-cms/terms-conditions";

public interface APIService
{
  @FormUrlEncoded
  @POST("credit-wallet")
  public abstract Call<CreditWalletReq> AddCreditWalletRequest(@Field("language") String paramString1, @Field("user_id") String paramString2, @Field("token") String paramString3, @Field("payment_array") String paramString4);
  
  @FormUrlEncoded
  @POST("check-social-login-id")
  public abstract Call<FaceBookReq> CheckFaceBookLoginReqMethod(@Field("language") String paramString1, @Field("user_type") String paramString2, @Field("facebook_id") String paramString3);
  
  @FormUrlEncoded
  @POST("check-social-login-id")
  public abstract Call<GPlusCheckReq> CheckGooglePlusLoginReqMethod(@Field("language") String paramString1, @Field("user_type") String paramString2, @Field("gplus_id") String paramString3);
  
  @FormUrlEncoded
  @POST("check-social-user-credientials")
  public abstract Call<SocUserCredReqResp> CheckSocialUserCredientialsReqMethod(@Field("language") String paramString1, @Field("user_type") String paramString2, @Field("email") String paramString3, @Field("phone") String paramString4);
  
  @FormUrlEncoded
  @POST("check-user-last-order")
  public abstract Call<CheckReviewReq> CheckUserLatestOrderReview(@Field("language") String paramString1, @Field("user_id") String paramString2, @Field("token") String paramString3);
  
  @FormUrlEncoded
  @POST("location-list")
  public abstract Call<LocListApiResp> CityBasedLocationList(@Field("language") String paramString1, @Field("country_id") String paramString2, @Field("city_id") String paramString3);
  
  @GET("getcity/{lang}")
  public abstract Call<cityList> CityList(@Path("lang") String paramString);
  
  @FormUrlEncoded
  @POST("currency-converter")
  public abstract Call<CurrConvRes> CurrentyConverterRequest(@Field("user_id") String paramString1, @Field("token") String paramString2, @Field("currency_amount") String paramString3, @Field("from_currency") String paramString4);
  
  @FormUrlEncoded
  @POST("getpromotion_list")
  public abstract Call<PromotionReq> GetPromotionsList(@Field("language") String paramString1, @Field("city") String paramString2, @Field("location") String paramString3);
  
  @FormUrlEncoded
  @POST("getoffers_list")
  public abstract Call<OffersRespReq> GetPromotionsOffersList(@Field("language") String paramString1, @Field("user_id") String paramString2, @Field("token") String paramString3);
  
  @FormUrlEncoded
  @POST("city-list")
  public abstract Call<CityRes> LocationList(@Field("language") String paramString1, @Field("country_id") String paramString2);
  
  @FormUrlEncoded
  @POST("order_detail")
  public abstract Call<OrderDetail> Order_detail_call(@Field("language") String paramString1, @Field("order_id") String paramString2, @Field("user_id") String paramString3, @Field("city_id") String paramString4, @Field("location_id") String paramString5, @Field("token") String paramString6);
  
  @FormUrlEncoded
  @POST("order-driver-location-details")
  public abstract Call<DriverLocDetRes> Order_driver_loc_req_method(@Field("language") String paramString1, @Field("order_id") String paramString2, @Field("user_id") String paramString3, @Field("token") String paramString4);
  
  @FormUrlEncoded
  @POST("send-otp-profile")
  public abstract Call<RegNewOTPReq> ProfEditReSendOTPReq(@Field("language") String paramString1, @Field("user_id") String paramString2, @Field("first_name") String paramString3, @Field("last_name") String paramString4, @Field("phone") String paramString5, @Field("gender") String paramString6, @Field("android_device_id") String paramString7, @Field("android_device_token") String paramString8, @Field("email") String paramString9, @Field("token") String paramString10);
  
  @FormUrlEncoded
  @POST("verify-otp-new-mobile")
  public abstract Call<SendOTP> RegOTPVerifyReq(@Field("language") String paramString1, @Field("user_id") String paramString2, @Field("phone") String paramString3, @Field("type") String paramString4, @Field("password") String paramString5, @Field("otp") String paramString6);
  
  @FormUrlEncoded
  @POST("send-otp-new-mobile")
  public abstract Call<RegNewOTPReq> RegReSendOTPReq(@Field("language") String paramString1, @Field("user_id") String paramString2, @Field("phone") String paramString3);
  
  @FormUrlEncoded
  @POST("contact-us")
  public abstract Call<SendFeedBackReq> SendFeedBackReqMethod(@Field("name") String paramString1, @Field("mobile_number") String paramString2, @Field("email") String paramString3, @Field("city") String paramString4, @Field("enquery_type") String paramString5, @Field("message") String paramString6, @Field("language") String paramString7);
  
  @FormUrlEncoded
  @POST("verify-otp-new-mobile")
  public abstract Call<SendOTP> SignUpOTPVerifyReq(@Field("language") String paramString1, @Field("user_id") String paramString2, @Field("phone") String paramString3, @Field("otp") String paramString4);
  
  @Multipart
  @POST("signup_user")
  public abstract Call<Signup> Sign_up_with_prof_img_call(@Part("first_name") RequestBody paramRequestBody1, @Part("last_name") RequestBody paramRequestBody2, @Part("email") RequestBody paramRequestBody3, @Part("password") RequestBody paramRequestBody4, @Part("phone") RequestBody paramRequestBody5, @Part("gender") RequestBody paramRequestBody6, @Part("terms_condition") RequestBody paramRequestBody7, @Part("login_type") RequestBody paramRequestBody8, @Part("language") RequestBody paramRequestBody9, @Part("device_id") RequestBody paramRequestBody10, @Part("device_token") RequestBody paramRequestBody11, @Part MultipartBody.Part paramPart);
  
  @Multipart
  @POST("update_profile_image")
  public abstract Call<ProfImgUpdate> UpdateProfilePicRequest(@Part("language") RequestBody paramRequestBody1, @Part("token") RequestBody paramRequestBody2, @Part("user_id") RequestBody paramRequestBody3, @Part MultipartBody.Part paramPart);
  
  @FormUrlEncoded
  @POST("user_wallet")
  public abstract Call<WalletReq> UserWalletRequest(@Field("language") String paramString1, @Field("user_id") String paramString2, @Field("token") String paramString3);
  
  @FormUrlEncoded
  @POST("wallet-payment")
  public abstract Call<WalPaymReq> WalletPaymentReq(@Field("language") String paramString1, @Field("user_id") String paramString2, @Field("token") String paramString3, @Field("payment_array") String paramString4, @Field("payment_params") String paramString5);
  
  @FormUrlEncoded
  @POST("add_to_cart")
  public abstract Call<AddToCart> add_to_cart(@Field("language") String paramString1, @Field("vendors_id") String paramString2, @Field("user_id") String paramString3, @Field("product_id") String paramString4, @Field("qty") String paramString5, @Field("outlet_id") String paramString6, @Field("token") String paramString7);
  
  @POST("address_type")
  public abstract Call<AddressType> address_type();
  
  @FormUrlEncoded
  @POST("addto_favourite")
  public abstract Call<AddFavourites> addto_favourite(@Field("user_id") String paramString1, @Field("vendor_id") String paramString2, @Field("outlet_id") String paramString3, @Field("token") String paramString4, @Field("language") String paramString5);
  
  @FormUrlEncoded
  @POST("current-location")
  public abstract Call<AutoDetectLocation> auto_detect_location(@Field("language") String paramString1, @Field("latitude") String paramString2, @Field("longitude") String paramString3);
  
  @FormUrlEncoded
  @POST("token")
  public abstract Call<PaypalRes> basicLogin(@Field("grant_type") String paramString);
  
  @FormUrlEncoded
  @POST("cancel_order")
  public abstract Call<CancelOrder> cancel_order_call(@Field("language") String paramString1, @Field("order_id") String paramString2, @Field("user_id") String paramString3, @Field("token") String paramString4);
  
  @FormUrlEncoded
  @POST("cart_count")
  public abstract Call<CartCount> cart_count_call(@Field("user_id") String paramString1, @Field("language") String paramString2, @Field("token") String paramString3);
  
  @FormUrlEncoded
  @POST("check_otp")
  public abstract Call<SendOTP> checkOTP(@Field("token") String paramString1, @Field("user_id") String paramString2, @Field("language") String paramString3, @Field("otp") String paramString4);
  
  @FormUrlEncoded
  @POST("check-delivery-address")
  public abstract Call<CheckDeliveryAddress> check_delivery_address(@Field("outlet_id") String paramString1, @Field("location_id") String paramString2, @Field("language") String paramString3, @Field("user_id") String paramString4, @Field("token") String paramString5);
  
  @FormUrlEncoded
  @POST("checkout_detail")
  public abstract Call<ProcToCheck> checkout_detail(@Field("user_id") String paramString1, @Field("language") String paramString2, @Field("cart") String paramString3, @Field("vendors_id") String paramString4);
  
  @FormUrlEncoded
  @POST("checkout_detail")
  public abstract Call<ProcToCheck> checkout_detail_call(@Field("user_id") String paramString1, @Field("language") String paramString2);
  
  @FormUrlEncoded
  @POST("country-list")
  public abstract Call<CountryList> country_list(@Field("language") String paramString);
  
  @FormUrlEncoded
  @POST("delete_address")
  public abstract Call<DeleteAddress> delete_address(@Field("language") String paramString1, @Field("user_id") String paramString2, @Field("address id") String paramString3);
  
  @FormUrlEncoded
  @POST("signup_fb_user")
  public abstract Call<FaceBookRegReq> facebook_signup_user(@Field("facebook_id") String paramString1, @Field("email") String paramString2, @Field("name") String paramString3, @Field("first_name") String paramString4, @Field("last_name") String paramString5, @Field("gender") String paramString6, @Field("image_url") String paramString7, @Field("device_id") String paramString8, @Field("device_token") String paramString9, @Field("language") String paramString10, @Field("user_type") String paramString11, @Field("login_type") String paramString12, @Field("mobile") String paramString13);
  
  @FormUrlEncoded
  @POST("filter-option-list")
  public abstract Call<FilterSettings> filter_settings_api(@Field("user_id") String paramString1, @Field("language") String paramString2);
  
  @FormUrlEncoded
  @POST("forgot_password")
  public abstract Call<ForgotPassword> forgot_password(@Field("email") String paramString1, @Field("language") String paramString2);
  
  @FormUrlEncoded
  @POST("guest-offline-payment")
  public abstract Call<GustCheckOutReq> getExpressCheckoutRequest(@Field("language") String paramString1, @Field("first_name") String paramString2, @Field("last_name") String paramString3, @Field("email") String paramString4, @Field("mobile") String paramString5, @Field("city_id") String paramString6, @Field("location_id") String paramString7, @Field("address") String paramString8, @Field("flat_number") String paramString9, @Field("landmark") String paramString10, @Field("latitude") String paramString11, @Field("longitude") String paramString12, @Field("address_type") String paramString13, @Field("payment_array") String paramString14, @Field("guest_type") String paramString15, @Field("login_type") String paramString16, @Field("device_id") String paramString17, @Field("device_token") String paramString18);
  
  @GET("languages")
  Call<Language> getLanguage();
  
  @GET("getlocation/{language}")
  public abstract Call<Location> getLoction(@Path("language") String paramString);
  
  @FormUrlEncoded
  @POST("outlet-details")
  public abstract Call<VendorDetailForMyCart> getOutletDetails(@Field("language") String paramString1, @Field("vendor_id") String paramString2, @Field("outlet_id") String paramString3, @Field("city") String paramString4, @Field("location") String paramString5);
  
  @GET("payment/{payment_id}")
  public abstract Call<PayPalPaymentRes> getPaymentDetails(@Path("payment_id") String paramString);
  
  @GET("store_banner")
  public abstract Call<StoProdBanner> getStoProdBanner();
  
  @FormUrlEncoded
  @POST("get_address")
  public abstract Call<AddressListing> get_address(@Field("user_id") String paramString1, @Field("language") String paramString2, @Field("user_token") String paramString3);
  
  @FormUrlEncoded
  @POST("categorylist")
  public abstract Call<CategoriesList> get_categories_list(@Field("language") String paramString1, @Field("type") String paramString2);
  
  @POST("get_coperatives")
  public abstract Call<Cooperatives> get_coperatives();
  
  @FormUrlEncoded
  @POST("favourites")
  public abstract Call<MyFavourites> get_favourites_list(@Field("language") String paramString1, @Field("user_id") String paramString2, @Field("token") String paramString3, @Field("type") String paramString4, @Field("city_id") String paramString5, @Field("location_id") String paramString6);
  
  @FormUrlEncoded
  @POST("store_featurelist_mob")
  public abstract Call<FeaturedStoresList> get_features_store_list(@Field("language") String paramString1, @Field("type") String paramString2);
  
  @FormUrlEncoded
  @POST("store_list")
  public abstract Call<StoreList> get_home_page_storeList(@Field("location") String paramString1, @Field("city") String paramString2, @Field("language") String paramString3, @Field("open_restaurant") String paramString4, @Field("open_offer") String paramString5, @Field("sortby") String paramString6, @Field("orderby") String paramString7, @Field("p_methods") String paramString8, @Field("cuisine_ids") String paramString9);
  
  @FormUrlEncoded
  @POST("location_outlet")
  public abstract Call<LocationOutlet> get_location_outlet_list(@Field("latitude") String paramString1, @Field("longitude") String paramString2, @Field("language") String paramString3);
  
  @FormUrlEncoded
  @POST("notification-list")
  public abstract Call<NotifiListResp> get_notification_list_call(@Field("user_id") String paramString1, @Field("token") String paramString2, @Field("language") String paramString3);
  
  @FormUrlEncoded
  @POST("store_info_mob")
  public abstract Call<StoProdVendorInfo> get_store_Prod_VenderInfo(@Field("language") String paramString1, @Field("outlet_id") String paramString2, @Field("city") String paramString3, @Field("location") String paramString4, @Field("user_id") String paramString5, @Field("token") String paramString6);
  
  @FormUrlEncoded
  @POST("store_outlet_list")
  public abstract Call<Outlet> get_store_outlet_list(@Field("language") String paramString1, @Field("store_id") String paramString2, @Field("city_id") String paramString3, @Field("location") String paramString4);
  
  @FormUrlEncoded
  @POST("store_product_mob")
  public abstract Call<ProductList> get_store_product_list(@Field("language") String paramString1, @Field("user_id") String paramString2, @Field("token") String paramString3, @Field("store_id") String paramString4, @Field("category_id") String paramString5, @Field("outlet_id") String paramString6, @Field("product_name") String paramString7);
  
  @FormUrlEncoded
  @POST("getoffers_list")
  public abstract Call<Offerlist> getoffers_list(@Field("language") String paramString1, @Field("user_id") String paramString2, @Field("token") String paramString3);
  
  @FormUrlEncoded
  @POST("locationlist")
  public abstract Call<LocationbasedCity> locationBasedCityList(@Field("language") String paramString1, @Field("city_id") String paramString2);
  
  @FormUrlEncoded
  @POST("login_user")
  public abstract Call<Login> login_user(@Field("email") String paramString1, @Field("password") String paramString2, @Field("login_type") String paramString3, @Field("user_type") String paramString4, @Field("device_id") String paramString5, @Field("device_token") String paramString6, @Field("language") String paramString7);
  
  @FormUrlEncoded
  @POST("signup_gplus_user")
  public abstract Call<Login> login_with_google_plus(@Field("language") String paramString1, @Field("gplus_id") String paramString2, @Field("gplus_token") String paramString3, @Field("email") String paramString4, @Field("name") String paramString5, @Field("user_type") String paramString6, @Field("first_name") String paramString7, @Field("last_name") String paramString8, @Field("login_type") String paramString9, @Field("device_id") String paramString10, @Field("device_token") String paramString11, @Field("image_url") String paramString12, @Field("mobile") String paramString13);
  
  @FormUrlEncoded
  @POST("get_cart")
  public abstract Call<MyCart> my_cart_call(@Field("language") String paramString1, @Field("user_id") String paramString2, @Field("token") String paramString3);
  
  @FormUrlEncoded
  @POST("delete-notification")
  public abstract Call<NotifiDeleteResp> notification_list_delete_call(@Field("user_id") String paramString1, @Field("token") String paramString2, @Field("language") String paramString3, @Field("notification_id") String paramString4);
  
  @FormUrlEncoded
  @POST("offline_payment")
  public abstract Call<OfflinePayment> offlinePayment(@Field("token") String paramString1, @Field("user_id") String paramString2, @Field("language") String paramString3, @Field("payment_array") String paramString4);
  
  @FormUrlEncoded
  @POST("online_payment")
  public abstract Call<OnlinePayRes> onlinnePayment(@Field("token") String paramString1, @Field("user_id") String paramString2, @Field("language") String paramString3, @Field("payment_array") String paramString4, @Field("payment_params") String paramString5);
  
  @FormUrlEncoded
  @POST("orders")
  public abstract Call<MyOrders> order_list(@Field("user_id") String paramString1, @Field("language") String paramString2, @Field("token") String paramString3);
  
  @FormUrlEncoded
  @POST("payment_gateway_list")
  public abstract Call<PaymentGateWayResp> paymentGatewayCall(@Field("language") String paramString);
  
  @FormUrlEncoded
  @POST("update_promocode")
  public abstract Call<PromoCode> promo_code_call(@Field("promo_code") String paramString1, @Field("user_id") String paramString2, @Field("outlet_id") String paramString3, @Field("language") String paramString4, @Field("token") String paramString5, @Field("total") String paramString6);
  
  @FormUrlEncoded
  @POST("re_order")
  public abstract Call<ReOrderReq> re_order_Request_call_method(@Field("order_id") String paramString1, @Field("user_id") String paramString2, @Field("language") String paramString3, @Field("type") String paramString4, @Field("token") String paramString5);
  
  @FormUrlEncoded
  @POST("return_order")
  public abstract Call<MyOrdRetOrdRes> return_order_call(@Field("user_id") String paramString1, @Field("order_id") String paramString2, @Field("token") String paramString3, @Field("language") String paramString4, @Field("return_reason") String paramString5, @Field("comments") String paramString6, @Field("vendor_name") String paramString7);
  
  @FormUrlEncoded
  @POST("send_otp")
  public abstract Call<SendOTP> sendOTP(@Field("token") String paramString1, @Field("user_id") String paramString2, @Field("language") String paramString3, @Field("otp_option") String paramString4);
  
  @FormUrlEncoded
  @POST("signup_user")
  public abstract Call<Signup> signup_user_without_prof_img_call(@Field("first_name") String paramString1, @Field("last_name") String paramString2, @Field("email") String paramString3, @Field("password") String paramString4, @Field("phone") String paramString5, @Field("gender") String paramString6, @Field("terms_condition") String paramString7, @Field("login_type") String paramString8, @Field("language") String paramString9, @Field("guest_type") String paramString10, @Field("user_type") String paramString11, @Field("device_id") String paramString12, @Field("device_token") String paramString13);
  
  @FormUrlEncoded
  @POST("store_address")
  public abstract Call<Addaddress> store_address(@Field("user_id") String paramString1, @Field("token") String paramString2, @Field("language") String paramString3, @Field("address type") String paramString4, @Field("latitude") String paramString5, @Field("longtitude") String paramString6, @Field("address") String paramString7, @Field("flat_number") String paramString8, @Field("landmark") String paramString9, @Field("country_id") String paramString10, @Field("city_id") String paramString11, @Field("location_id") String paramString12);
  
  @FormUrlEncoded
  @POST("store_review")
  public abstract Call<Review> store_review(@Field("store_id") String paramString1, @Field("outlet_id") String paramString2, @Field("language") String paramString3);
  
  @FormUrlEncoded
  @POST("update_cart")
  public abstract Call<MyCart> update_cart_call(@Field("language") String paramString1, @Field("user_id") String paramString2, @Field("token") String paramString3, @Field("qty") String paramString4, @Field("cart_detail_id") String paramString5, @Field("cart_id") String paramString6);
  
  @FormUrlEncoded
  @POST("update_password")
  public abstract Call<PassWordUpdResponse> update_password(@Field("token") String paramString1, @Field("user_id") String paramString2, @Field("old_password") String paramString3, @Field("password") String paramString4, @Field("password_confirmation") String paramString5, @Field("language") String paramString6);
  
  @FormUrlEncoded
  @POST("update_profile")
  public abstract Call<ProfUpdResponse> update_profile(@Field("user_id") String paramString1, @Field("first_name") String paramString2, @Field("last_name") String paramString3, @Field("phone") String paramString4, @Field("gender") String paramString5, @Field("android_device_id") String paramString6, @Field("android_device_token") String paramString7, @Field("language") String paramString8, @Field("email") String paramString9, @Field("token") String paramString10);
  
  @FormUrlEncoded
  @POST("user_rating")
  public abstract Call<StoRettingRes> update_store_review_call(@Field("vendor_id") String paramString1, @Field("outlet_id") String paramString2, @Field("user_id") String paramString3, @Field("order_id") String paramString4, @Field("starrating") String paramString5, @Field("comments") String paramString6);
  
  @FormUrlEncoded
  @POST("user_detail")
  public abstract Call<UserProfDet> user_Profile_Details(@Field("token") String paramString1, @Field("user_id") String paramString2);
}
