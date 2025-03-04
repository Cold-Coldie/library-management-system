import SideBar from "@/components/SideBar";
// import Orange from "../../../public/assets/orange-guy.svg";

const layout = ({ children }) => {
  return (
    <div className="flex h-screen ">
      <SideBar />
      <div className="flex-1 overflow-auto p-8 md:ml-64">
        <div className="flex gap-4 items-baseline">
          <h1 className=" md:text-4xl tracking-tight">Welcome back</h1>
          {/* <Orange /> */}
        </div>
        {children}
      </div>
    </div>
  );
};

export default layout;
