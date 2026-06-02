export const bgImg = "https://outer-cyan-sjyljau6dj.edgeone.app/RouterApp%27s%20bg.jpg"

export const signUpBgImage = "https://fundamental-azure-tspbn2owji.edgeone.app/chinh-le-duc-P19iVmm7XUA-unsplash.jpg"

export const signUpBgVideo = "https://www.image2url.com/r2/default/videos/1776411007961-f745f1e4-4124-41a0-9a5f-68862bf66b1e.mp4"

export const InputField = ({
  type = "text",
  placeholder,
  name,
  value,
  onChange,
}) => {
  return (
    <div className="flex items-center rounded-xl bg-white px-4 py-3 shadow-md">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-transparent text-gray-800 outline-none placeholder:text-gray-400"
      />
    </div>
  );
};