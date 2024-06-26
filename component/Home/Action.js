import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Share,
} from "react-native";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import { AuthContext } from "../Context";
import { imageLink } from "../ImageLink";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { SliderBox } from "react-native-image-slider-box";
import FastImage from "react-native-fast-image";
import { customErrorNotification } from "../ErrorHandle";

export default React.memo(function Action({ product: newProduct, navigation }) {
  const [comment, setComment] = useState("");
  const [like, setLike] = useState(false);
  const [product, setProduct] = useState(newProduct);
  const [doubleClick, setDoubleClick] = useState(0);
  const data = useContext(AuthContext);
  const { token, decode, products } = data;
  const config = {
    headers: {
      "access-token": token,
    },
  };

  useEffect(() => {
    if (products.length) {
      var findProduct = products.find((p) => p._id == product._id);
      if (findProduct) setProduct(findProduct);
    }
  }, [products]);

  const handle = useRef();

  const currentValue = useSharedValue(1);
  const scaleHeart = useSharedValue(0);

  const rStyle = useAnimatedStyle(() => ({
    transform: [{ scale: currentValue.value ? currentValue.value : 1 }],
  }));

  const mStyle = useAnimatedStyle(() => ({
    transform: [{ scale: Math.max(scaleHeart.value, 0) }],
  }));

  useEffect(() => {
    var isLiked = product?.likes.find((like) => like.user_id == decode._id);
    if (isLiked) {
      setLike(true);
    } else {
      setLike(false);
    }
  }, [decode, newProduct]);

  const addLike = async () => {
    currentValue.value = withSpring(0.1, undefined, (isFinished) => {
      if (isFinished) {
        currentValue.value = withSpring(1);
      }
    });
    scaleHeart.value = withSpring(1, undefined, (isFinished) => {
      if (isFinished) {
        scaleHeart.value = withSpring(0);
      }
    });
    try {
      const data = {
        action: like ? "unlike" : "like",
      };
      if (like) {
        setProduct({ ...product, likes_count: product.likes_count - 1 });
      } else {
        setProduct({ ...product, likes_count: product.likes_count + 1 });
      }
      setLike(!like);
      const response = await axios.post(
        "/post/like/post/" + product._id,
        data,
        config
      );
    } catch (error) {
      if (like) {
        setProduct({ ...product, likes_count: product.likes_count + 1 });
      } else {
        setProduct({ ...product, likes_count: product.likes_count - 1 });
      }
      setLike(like);
    }
  };

  const parseImages = useCallback((image, images) => {
    var arr = [imageLink + image];
    images.forEach((image) => {
      arr.push(imageLink + image);
    });
    return arr;
  }, []);

  const singleOrDoubleClick = useCallback(
    (item) => {
      if (doubleClick >= 1) {
        if (handle.current) {
          clearTimeout(handle.current);
        }
        setDoubleClick(0);
        // Double Clicked
        addLike();
      } else {
        setDoubleClick(doubleClick + 1);
        handle.current = setTimeout(() => {
          setDoubleClick(0);
          // Single Click
          navigation.navigate("Product Detail", item);
        }, 300);
      }
    },
    [doubleClick]
  );

  const onShare = useCallback(async (item) => {
    try {
      const result = await Share.share({
        message: `${item.name} \n\n रु ${item.price} \n\n${imageLink}/product-detail/${item._id}`,
      });
      if (result.action === Share.sharedAction) {
        // shared
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      customErrorNotification(error.message);
    }
  }, []);

  return (
    <>
      <TouchableOpacity
        onPress={() => navigation.navigate("Product Detail", product)}
      >
        <View style={{ marginBottom: 5 }} key={product._id}>
          <TouchableOpacity
            onPress={() => navigation.navigate("My Closet", product.seller_id)}
            style={styles.userWrapper}
          >
            <Image
              style={styles.userimage}
              source={{ uri: imageLink + product.seller_id?.image }}
            ></Image>
            <Text style={styles.username}>{product.seller_id?.name}</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      <View style={styles.productWrapper}>
        <View style={styles.product}>
          <Animated.View style={[styles.bigHeart, mStyle]}>
            <MaterialCommunityIcons
              name="cards-heart"
              size={130}
              color="white"
              style={styles.bigHeartIcon}
            />
          </Animated.View>

          {product.stock <= 0 ? (
            <View style={styles.isSold}>
              <Text style={styles.isSoldText}>Sold</Text>
            </View>
          ) : null}

          <SliderBox
            images={parseImages(product.image, product.feature_image)}
            ImageComponent={__DEV__ ? Image : FastImage}
            ImageComponentStyle={styles.productImage}
            dotColor="#663399"
            imageLoadingColor="#663399"
            activeOpacity={1}
            onCurrentImagePressed={() => singleOrDoubleClick(product)}
            pagingEnabled
            resizeMode="contain"
            enablePinchable={__DEV__ ? false : true}
          />

          <View style={styles.productreview}>
            <TouchableOpacity
              onPress={() => addLike()}
              style={{ marginRight: 5 }}
            >
              {like ? (
                <Animated.View style={rStyle}>
                  <MaterialCommunityIcons
                    name="cards-heart"
                    size={25}
                    color="red"
                  />
                </Animated.View>
              ) : (
                <Animated.View style={rStyle}>
                  <MaterialCommunityIcons
                    name="heart-outline"
                    size={25}
                    color="black"
                  />
                </Animated.View>
              )}
            </TouchableOpacity>

            {/* <View>
                <Image source={require('../../assets/icons/Shop.png')} style={styles.smallIcon}/>
                </View> */}

            <TouchableOpacity
              onPress={() => navigation.navigate("Comments", product._id)}
            >
              <Image
                source={require("../../assets/icons/Comment.png")}
                style={styles.smallIcon}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => onShare(product)}>
              <Image
                source={require("../../assets/icons/Share.png")}
                style={styles.smallIcon}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.typeWrapper}>
            <Text style={styles.productname}>{product.likes_count} Likes</Text>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate("Product Detail", product)}
          >
            <View style={styles.typeWrapper}>
              <View>
                <Text style={styles.productname} numberOfLines={1}>
                  {product.name}
                </Text>
              </View>
              <View>
                <Text style={styles.type}>{product.type}</Text>
              </View>
            </View>
            <View style={styles.detailWrapper}>
              <Text style={styles.price}>Rs. {product.price}</Text>
              <Text>|</Text>
              <Text style={styles.size}>Size: {product.size_id?.name}</Text>
              <Text>|</Text>
              <Text style={styles.brand}>{product.brand_id?.name}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Comments", product._id)}
            style={styles.typeWrapper}
          >
            <Text style={styles.viewComment}>
              View All {product.comments_count} Comments
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
});

const styles = StyleSheet.create({
  bigHeartIcon: {
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.95,
    shadowRadius: 35,
    elevation: 20,
    shadowColor: "#000",
    zIndex: 100,
  },
  bigHeart: {
    position: "absolute",
    left: Dimensions.get("window").width / 2 - 70,
    top: 130,
    zIndex: 1000,
  },
  isSold: {
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.35,
    shadowRadius: 35,
    elevation: 10,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: "#fa4a0c",
    position: "absolute",
    right: 20,
    top: 350,
    alignContent: "center",
    zIndex: 4,
  },
  isSoldText: {
    fontFamily: "Raleway_500Medium",
    color: "white",
  },

  productreview: {
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  viewComment: {
    fontSize: 13,
    fontWeight: "500",
    fontFamily: "Raleway_500Medium",
    color: "rgba(0, 0, 0, 0.5)",
  },
  smallIcon: {
    height: 25,
    width: 25,
    marginRight: 5,
  },
  activeIcon: {
    height: 25,
    width: 25,
    marginRight: 5,
    color: "red",
  },
  productWrapper: {
    marginBottom: 20,
  },
  userWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  userimage: {
    height: 34,
    width: 34,
    borderWidth: 2,
    borderColor: "rebeccapurple",
    padding: 5,
    borderRadius: 17,
  },
  username: {
    fontSize: 16,
    textTransform: "capitalize",
    marginLeft: 6,
  },
  product: {},
  productImage: {
    height: 400,
    width: Dimensions.get("window").width,
    resizeMode: "contain",
    zIndex: 99,
    flex: 1,
  },
  typeWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,

    marginBottom: 5,
  },
  detailWrapper: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  productname: {
    fontSize: 16,
    fontWeight: "600",
    textTransform: "capitalize",
    width: 180,
  },
  type: {
    fontSize: 14,
    paddingHorizontal: 10,
    paddingVertical: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    textTransform: "capitalize",
  },
  price: {
    fontSize: 15,
    fontWeight: "bold",
    marginRight: 5,
  },
  size: {
    fontSize: 15,
    marginHorizontal: 5,
  },
  brand: {
    fontSize: 15,
    marginLeft: 5,
  },
  productreview: {
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  reviewicon: {
    marginRight: 10,
  },
});
