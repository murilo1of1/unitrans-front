"use client";

import { Drawer as ChakraDrawer } from "@chakra-ui/react";
import { forwardRef } from "react";

export const DrawerRoot = forwardRef(function DrawerRoot(props, ref) {
  return <ChakraDrawer.Root ref={ref} {...props} />;
});

export const DrawerBackdrop = forwardRef(function DrawerBackdrop(props, ref) {
  return <ChakraDrawer.Backdrop ref={ref} {...props} />;
});

export const DrawerContent = forwardRef(function DrawerContent(props, ref) {
  return <ChakraDrawer.Content ref={ref} {...props} />;
});

export const DrawerHeader = forwardRef(function DrawerHeader(props, ref) {
  return <ChakraDrawer.Header ref={ref} {...props} />;
});

export const DrawerBody = forwardRef(function DrawerBody(props, ref) {
  return <ChakraDrawer.Body ref={ref} {...props} />;
});

export const DrawerCloseTrigger = forwardRef(function DrawerCloseTrigger(
  props,
  ref
) {
  return <ChakraDrawer.CloseTrigger ref={ref} {...props} />;
});
