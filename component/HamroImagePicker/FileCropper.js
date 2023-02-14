import {
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import * as ImageManipulator from "expo-image-manipulator";
import { MaterialIcons } from "@expo/vector-icons";
import FastImage from "react-native-fast-image";

const FileCropper = ({ setSelectedImageData, imageData }) => {
  const [imageURI, setImageURI] = useState(imageData.uri);

  const [enableTransformTools, setEnableTransformTools] = useState(false);
  const [enableAdjustTools, setEnableAdjustTools] = useState(false);

  function handleTransformToolsClicked() {
    setEnableTransformTools(!enableTransformTools);
    if (enableAdjustTools) {
      setEnableAdjustTools(false);
    }
  }

  function handleAdjustToolsClicked() {
    setEnableAdjustTools(!enableAdjustTools);
    if (enableTransformTools) {
      setEnableTransformTools(false);
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.dimBackground}>
        <View style={{ marginLeft: 10, flexDirection: "row" }}>
          <TouchableOpacity onPress={() => setSelectedImageData({})}>
            <MaterialIcons name="arrow-back" size={25} color="white" />
          </TouchableOpacity>
        </View>
        <View style={{ marginRight: 10 }}>
          <TouchableOpacity onPress={() => console.log("close")}>
            <MaterialIcons name="check" size={25} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={{
          height: Dimensions.get("window").height - 180,
          width: Dimensions.get("window").width,
        }}
      >
        <ImageBackground
          source={{ uri: imageURI }}
          style={{
            height: Dimensions.get("window").height - 180,
            width: Dimensions.get("window").width,
          }}
          resizeMode={"contain"}
          resizeMethod={"resize"}
        />
      </View>

      <View style={styles.dimBackground}>
        {enableTransformTools ? (
          <TransformTools />
        ) : enableAdjustTools ? (
          <AdjustTools />
        ) : (
          <View
            style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "500",
                textAlign: "center",
              }}
            >
              Choose Tools to Edit
            </Text>
          </View>
        )}
      </View>
      <View style={styles.dimBackground}>
        <TouchableOpacity onPress={() => handleTransformToolsClicked()}>
          <View
            style={[
              styles.tools,
              {
                backgroundColor: enableTransformTools ? "#000" : "transparent",
              },
            ]}
          >
            <MaterialIcons name="transform" size={35} color="white" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleAdjustToolsClicked()}>
          <View
            style={[
              styles.tools,
              {
                backgroundColor: enableAdjustTools ? "#000" : "transparent",
              },
            ]}
          >
            <MaterialIcons name="tune" size={35} color="white" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const AdjustTools = () => {
  return (
    <View style={{ flexDirection: "row", height: "100%" }}>
      <TouchableHighlight
        style={styles.options}
        onPress={() => console.log("closing")}
        underlayColor="#000"
      >
        <MaterialIcons name="blur-on" size={25} color="white" />
      </TouchableHighlight>
    </View>
  );
};

const TransformTools = () => {
  return (
    <View style={{ flexDirection: "row", height: "100%" }}>
      <TouchableHighlight
        style={styles.options}
        onPress={() => console.log("closing")}
      >
        <MaterialIcons name="crop" size={25} color="white" />
      </TouchableHighlight>
      <TouchableHighlight
        style={styles.options}
        onPress={() => console.log("close")}
      >
        <MaterialIcons name="rotate-90-degrees-ccw" size={25} color="white" />
      </TouchableHighlight>
    </View>
  );
};

export default FileCropper;

const styles = StyleSheet.create({
  dimBackground: {
    alignItems: "center",
    height: 60,
    width: Dimensions.get("window").width,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "rgba(100, 100, 100, 0.2)",
  },
  tools: {
    flexDirection: "row",
    width: Dimensions.get("window").width / 2,
    height: "100%",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  options: {
    height: "100%",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
});
