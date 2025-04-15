import React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";

interface BookCoverProps {
  imageUrl: string;
  altText?: string;
  width?: number | string;
  height?: number | string;
}

const StyledCover = styled(Box)<{
  width: string | number;
  height: string | number;
}>(({ theme, width, height }) => ({
  width,
  height,
  borderRadius: theme.shape.borderRadius * 1,
  overflow: "hidden",
  boxShadow: theme.shadows[3],
  backgroundColor: theme.palette.grey[100],
}));

const StyledImage = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
});

const BookCover: React.FC<BookCoverProps> = ({
  imageUrl,
  altText = "Book cover",
  width = 120,
  height = 180,
}) => {
  return (
    <StyledCover width={width} height={height}>
      <StyledImage src={imageUrl} alt={altText} />
    </StyledCover>
  );
};

export default BookCover;
