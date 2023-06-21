import React, { useRef, useEffect } from "react";
import { Box } from "@chakra-ui/react";

function SwipeListItem({ name }) {
  const listElementRef = useRef();
  const wrapperRef = useRef();
  const backgroundRef = useRef();

  const dragStartXRef = useRef(0);
  const leftRef = useRef(0);
  const draggedRef = useRef(false);

  useEffect(() => {
    window.addEventListener("mouseup", onDragEndMouse);
    window.addEventListener("touchend", onDragEndTouch);
    return () => {
      window.removeEventListener("mouseup", onDragEndMouse);
      window.removeEventListener("touchend", onDragEndTouch);
    };
  });

  function onDragStartMouse(evt) {
    onDragStart(evt.clientX);
    window.addEventListener("mousemove", onMouseMove);
  }

  function onDragStartTouch(evt) {
    const touch = evt.targetTouches[0];
    onDragStart(touch.clientX);
    window.addEventListener("touchmove", onTouchMove);
  }

  function onDragStart(clientX) {
    draggedRef.current = true;
    dragStartXRef.current = clientX;

    listElementRef.current.className = "ListItem";

    requestAnimationFrame(updatePosition);
  }

  function updatePosition() {
    if (draggedRef.current) {
      requestAnimationFrame(updatePosition);
    }

    listElementRef.current.style.transform = `translateX(${leftRef.current}px)`;
  }

  function onMouseMove(evt) {
    const left = evt.clientX - dragStartXRef.current;
    if (left < 0) {
      leftRef.current = left;
    }
  }

  function onTouchMove(evt) {
    const touch = evt.targetTouches[0];
    const left = touch.clientX - dragStartXRef.current;
    if (left < 0) {
      leftRef.current = left;
    }
  }

  function onDragEndMouse(evt) {
    window.removeEventListener("mousemove", onMouseMove);
    onDragEnd();
  }

  function onDragEndTouch(evt) {
    window.removeEventListener("touchmove", onTouchMove);
    onDragEnd();
  }

  function onDragEnd() {
    if (draggedRef.current) {
      draggedRef.current = false;
      const threshold = 0.5;

      if (leftRef.current < listElementRef.current.offsetWidth * threshold * -1) {
        leftRef.current = -listElementRef.current.offsetWidth * 2;

        if (window.confirm("내역을 삭제하시겠습니까?")) {
          //confirm delete
          wrapperRef.current.style.maxHeight = 0;
        } else {
          leftRef.current = 0;
        }
      } else {
        leftRef.current = 0;
      }

      listElementRef.current.className = "BouncingListItem";
      listElementRef.current.style.transform = `translateX(${leftRef.current}px)`;
    }
  }

  return (
    <>
      {/* <Flex
        position="relative"
        transition="max-height 0.5s ease"
        maxHeight="1000px"
        transformOrigin="top"
        overflow="hidden"
        w="100%"
        cursor="pointer"
        fontSize="18px"
        ref={wrapperRef}
      >
        <Flex
          position="absolute"
          w="100%"
          h="100%"
          zIndex="-1"
          justifyContent="flex-end"
          flexDirection="row"
          alignItems="center"
          backgroundColor="red"
          boxSizing="border-box"
          ref={backgroundRef}
        >
          <Text as="span">delete</Text>
        </Flex>
        <Flex
          transition="transform 0.5s ease-out"
          boxSizing="border-box"
          alignItems="center"
          backgroundColor="red"
          w="100%"
          h="100%"
          ref={listElementRef}
          onMouseDown={onDragStartMouse}
          onTouchStart={onDragStartTouch}
        >
          <Box className="DataList">
            <Text>{name}</Text>
          </Box>
        </Flex>
      </Flex> */}

      <Box className="Wrapper" ref={wrapperRef}>
        <Box className="Background" ref={backgroundRef}>
          <span>delete</span>
        </Box>
        <Box
          className="BouncingListItem"
          ref={listElementRef}
          onMouseDown={onDragStartMouse}
          onTouchStart={onDragStartTouch}
        >
          <Box className="DataList">
            <Box>{name}</Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default SwipeListItem;
