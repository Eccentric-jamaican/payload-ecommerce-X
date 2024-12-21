import Image from "next/image";

const Avatar = (props: any) => {
  return (
    <div className="flex items-center justify-center">
      <Image
        src={props.user.avatar.url}
        style={{ height: 38, width: 38, borderRadius: "50%" }}
        alt="avatar"
        height={38}
        width={38}
      />
    </div>
  );
};

export default Avatar;
