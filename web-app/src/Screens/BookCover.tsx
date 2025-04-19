import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";

interface BookCoverProps {
  imageUrl: string;
  fallbackImageUrl?: string;
  onClick?: () => void;
  bookName?: string;
  width?: number | string;
  height?: number | string;
}

const StyledCover = styled(Box)<{
  width: string | number;
  height: string | number;
  onClick?: () => void;
}>(({ theme, width, height }) => ({
  width,
  height,
  cursor: "pointer",
  overflow: "hidden",
  boxShadow: theme.shadows[10],
  backgroundColor: theme.palette.grey[300],
  borderRadius: theme.shape.borderRadius * 1,
  // If no image we show a white box but still needs on hover effect
  transition: "background-color 0.3s",
  "&:hover": {
    backgroundColor: theme.palette.grey[200],
  },
}));

const StyledImage = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
  // Hover effect for img
  transition: "filter 0.2s ease",
  "&:hover": {
    filter: "brightness(0.9)", // make image brighter on hover
  },
});

const BookCover: React.FC<BookCoverProps> = ({
  imageUrl,
  fallbackImageUrl,
  onClick,
  bookName = "Book cover",
  width = 120,
  height = 180,
}) => {
  const srcUrl = imageUrl?.trim() ? imageUrl : fallbackImageUrl;
  return (
    <StyledCover width={width} height={height} onClick={onClick}>
      <StyledImage src={srcUrl} alt={bookName} />
    </StyledCover>
  );
};

export default BookCover;
