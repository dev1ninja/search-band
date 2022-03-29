import { Button } from "@mui/material";

type Props = {
  text: string
}

function Item(props: Props){
  const {text} = props;
  return (
    <>
      <Button variant="outlined" sx={{width: "200px", borderRadius: "5px", color: "black", borderColor: "Grey", backgroundColor: "white"}}>{text}</Button>
    </>
  )
}

export default Item;