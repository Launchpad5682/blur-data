interface Props {
  changeHandler: any;
  value: any;
}

const ImageInput = (props: Props) => {
  const { changeHandler, value } = props;

  return (
    <div>
      <input type="file" name="" id="" onChange={changeHandler} />
    </div>
  );
};

export default ImageInput;
