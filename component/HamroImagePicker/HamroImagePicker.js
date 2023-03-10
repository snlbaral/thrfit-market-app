import { ImageBackground, StyleSheet, View } from "react-native";
import React, { useRef, useState } from "react";
import FileCollector from "./FileCollector";
import Modal from "react-native-modalbox";

const HamroImagePicker = ({
  handlePickerClose = () => {},
  handleSubmit = () => {},
  enablePicker,
  enableAlbums = true,
  ImageComponent = ImageBackground,
  enableCameraCapture = true,
  enableMultiSelect = false,
  multiSelectOptions = {
    minimumImageCount: 1,
    maximumImageCount: -1,
  },
  headerText = "New Post",
  backButtonClose = true,
  coverScreen = true,
  swipeToClose = true,
  enableEditor = true,
  editorOptions = {
    asView: false,
    mode: "full",
    fixedCropAspectRatio: 16 / 9,
    lockAspectRatio: false,
    minimumCropDimensions: {
      width: 100,
      height: 100,
    },
    throttleBlur: false,
    allowedTransformOperations: ["crop", "rotate"],
    allowedAdjustmentOperations: ["blur"],
  },
  multipleSelectEnabled = false,
}) => {
  const [selectedImageData, setSelectedImageData] = useState({});
  const [initLoading, setInitLoading] = useState(true);
  const modalRef = useRef();

  const submitSingleData = (data) => {
    handleSubmit({ hasMultiple: false, data });
    modalRef.current.close();
  };

  const submitMultipleData = (data) => {
    handleSubmit({ hasMultiple: true, data });
    modalRef.current.close();
  };

  return (
    <Modal
      isOpen={enablePicker}
      onClosed={() => handlePickerClose()}
      position={enablePicker ? "center" : undefined}
      backButtonClose={backButtonClose}
      coverScreen={coverScreen}
      swipeToClose={swipeToClose}
      ref={modalRef}
    >
      {enablePicker ? (
        <View style={{ flex: 1, backgroundColor: "#000000" }}>
          <View style={{ flex: 1, justifyContent: "center" }}>
            <FileCollector
              submitSingleData={submitSingleData}
              initLoading={initLoading}
              setInitLoading={setInitLoading}
              enableAlbums={enableAlbums}
              ImageComponent={ImageComponent}
              enableMultiSelect={enableMultiSelect}
              enableCameraCapture={enableCameraCapture}
              multiSelectOptions={multiSelectOptions}
              modalRef={modalRef}
              headerText={headerText}
              submitMultipleData={submitMultipleData}
              multipleSelectEnabled={multipleSelectEnabled}
            />
          </View>
        </View>
      ) : null}
    </Modal>
  );
};

export default HamroImagePicker;

const styles = StyleSheet.create({});
