import Item from "./Item";

type Props = {
  data: any;
};

const ActivityList = (props: Props) => {
  const { data } = props;
  return (
    <ul style={{width: "100%", listStyle: "none", padding: 0, position: "relative"}}>
      {data.map((item: string, index: number) => {
        return (
          <li key={index} style={{margin: "10px"}}>
            <Item text={item} key={index}></Item>
          </li>
        );
      })}
    </ul>
  );
};

export default ActivityList;
