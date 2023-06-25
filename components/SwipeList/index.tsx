import React, { useRef, useEffect } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { ChevronLeftIcon } from "@chakra-ui/icons";

interface SwipeListItemProps {
  id: string;
  name: string;
  date: string;
  description: string;
  deleteItem: (date: string, id: string) => void;
}

const SwipeListItem: React.FC<SwipeListItemProps> = ({ id, name, date, description, deleteItem }) => {
  const listElementRef = useRef<HTMLDivElement>();
  const wrapperRef = useRef<HTMLDivElement>();
  const backgroundRef = useRef<HTMLDivElement>();

  const dragStartXRef = useRef<number>(0);
  const leftRef = useRef<number>(0);
  const draggedRef = useRef<boolean>(false);

  useEffect(() => {
    window.addEventListener("mouseup", onDragEndMouse);
    window.addEventListener("touchend", onDragEndTouch);
    return () => {
      window.removeEventListener("mouseup", onDragEndMouse);
      window.removeEventListener("touchend", onDragEndTouch);
    };
  });

  const onDragStartMouse = (evt) => {
    onDragStart(evt.clientX);
    window.addEventListener("mousemove", onMouseMove);
  };

  const onDragStartTouch = (evt) => {
    const touch = evt.targetTouches[0];
    onDragStart(touch.clientX);
    window.addEventListener("touchmove", onTouchMove);
  };

  const onDragStart = (clientX: number) => {
    draggedRef.current = true;
    dragStartXRef.current = clientX;

    listElementRef.current.className = "ListItem";

    requestAnimationFrame(updatePosition);
  };

  const updatePosition = () => {
    if (draggedRef.current) {
      requestAnimationFrame(updatePosition);
    }

    listElementRef.current.style.transform = `translateX(${leftRef.current}px)`;
  };

  const onMouseMove = (evt) => {
    const left = evt.clientX - dragStartXRef.current;
    if (left < 0) {
      leftRef.current = left;
    }
  };

  const onTouchMove = (evt) => {
    const touch = evt.targetTouches[0];
    const left = touch.clientX - dragStartXRef.current;
    if (left < 0) {
      leftRef.current = left;
    }
  };

  const onDragEndMouse = () => {
    window.removeEventListener("mousemove", onMouseMove);
    onDragEnd();
  };

  const onDragEndTouch = () => {
    window.removeEventListener("touchmove", onTouchMove);
    onDragEnd();
  };

  function onDragEnd() {
    if (draggedRef.current) {
      draggedRef.current = false;
      const threshold = 0.5;

      if (leftRef.current < listElementRef.current.offsetWidth * threshold * -1) {
        leftRef.current = -listElementRef.current.offsetWidth * 2;

        if (window.confirm(`Confirm to delete task: ${name}?`)) {
          deleteItem(date, id);
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
    <Box className="Wrapper" ref={wrapperRef} marginBottom="5px" key={id}>
      <Box className="Background" ref={backgroundRef}>
        <Text as="span">Delete</Text>
      </Box>
      <Flex
        className="BouncingListItem"
        ref={listElementRef}
        onMouseDown={onDragStartMouse}
        onTouchStart={onDragStartTouch}
      >
        <Box flex="1" className="DataList">
          <Text fontSize={[18, 18, 20]}>{name}</Text>
          <Text fontSize={[14, 16, 18]}>{description}</Text>
        </Box>
        <Box padding="8px">
          <ChevronLeftIcon color="#a5a5a5" />
        </Box>
      </Flex>
    </Box>
  );
};

export default SwipeListItem;
