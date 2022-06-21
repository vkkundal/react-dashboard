declare module "*.svg"
declare module "*.png"
declare module "*.jpeg"

declare module "react-ios-switch" {
    const Switch: React.FC<{
        checked?: boolean
        onChange: () => void
        handleColor?: string
        offColor?: string
        onColor?: string
    }>;
    export default Switch;
}
