import { useGlobalState } from "~~/services/store/store";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { SwitchTheme } from "~~/components/SwitchTheme";

export const LandingNav = () => {
    const nativeCurrencyPrice = useGlobalState(state => state.nativeCurrencyPrice);

    return (
        <div className="navbar bg-base-100">
            <div className="navbar-start">
                <div className="dropdown">
                    <label tabIndex={0} className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                    </label>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        <li><a>Item 1</a></li>

                        <li><a>FAQ</a></li>
                    </ul>
                </div>
                <a className="btn btn-ghost normal-case text-xl">Stake4Fun</a>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">

                    <li><a href="#how-it-works">How it works</a></li>
                    <li><a href="#mission">Mission</a></li>
                    <li><a href="#how-it-works">FAQ</a></li>

                </ul>
            </div>

            <div className="navbar-end">
                {nativeCurrencyPrice > 0 && (
                    <div className="btn btn-primary btn-sm font-normal cursor-auto gap-0">
                        <CurrencyDollarIcon className="h-4 w-4 mr-0.5" />
                        <span>{nativeCurrencyPrice}</span>
                    </div>
                )}
                <div className="fixed flex justify-between items-center w-full z-10 p-4 bottom-0 left-0 pointer-events-none">

                    <SwitchTheme className="pointer-events-auto" />
                </div>
                <a className="btn" href="/dapp" target="_blank">Launch App</a>
            </div>
        </div>
    )
}