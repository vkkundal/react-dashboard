import { useEffect } from "react";
import $ from "jquery";

export const useAutoScrollonHash = () => {
    useEffect(() => {
        $(function () {
            $("a").on("click", function (event: any) {
                const self = this as any;
                if (self.hash !== "") {
                    event.preventDefault();
                    var hash = self.hash;
                    $("html, body").animate(
                        {
                            scrollTop: $(hash).offset()?.top,
                        },
                        800,
                        function () {
                            window.location.hash = hash;
                        }
                    );
                }
            });
        });
    }, []);
}