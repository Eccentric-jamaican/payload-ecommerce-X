import Image from "next/image";
import { User } from "@/payload-types";

const Avatar = (props: { user: User }) => {
  const getInitials = (user: User) => {
    const firstName = user.firstName || "";
    const lastName = user.lastName || "";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="flex items-center justify-center">
      {typeof props.user.avatar !== "string" && props.user.avatar?.url ? (
        <Image
          src={props.user.avatar.url}
          alt="avatar"
          height={38}
          width={38}
          className="rounded-full"
        />
      ) : (
        <div
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "50%",
            backgroundColor: "#e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#64748b",
            fontSize: "0.875rem",
            fontWeight: "bold",
            textTransform: "uppercase",
          }}
        >
          {getInitials(props.user)}
        </div>
      )}
    </div>
  );
};

export default Avatar;
