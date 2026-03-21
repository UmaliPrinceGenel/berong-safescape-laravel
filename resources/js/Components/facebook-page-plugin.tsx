"use client"

import { useEffect } from "react"

declare global {
  interface Window {
    FB?: any
  }
}

export function FacebookPagePlugin() {
  useEffect(() => {
    // Load Facebook SDK
    const loadFacebookSDK = () => {
      if (window.FB) return

      const script = document.createElement("script")
      script.async = true
      script.defer = true
      script.crossOrigin = "anonymous"
      script.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0"
      script.nonce = "facebook-sdk"
      document.body.appendChild(script)

      script.onload = () => {
        if (window.FB) {
          window.FB.XFBML.parse()
        }
      }
    }

    loadFacebookSDK()
  }, [])

  return (
    <div className="w-full">
      <div
        className="fb-page"
        data-href="https://www.facebook.com/BFPSantaCruz"
        data-tabs="timeline"
        data-width="300"
        data-height="500"
        data-small-header="false"
        data-adapt-container-width="true"
        data-hide-cover="false"
        data-show-facepile="true"
      >
        <blockquote
          cite="https://www.facebook.com/BFPSantaCruz"
          className="fb-xfbml-parse-ignore"
        >
          <a href="https://www.facebook.com/BFPSantaCruz">
            Bureau of Fire Protection Sta Cruz Laguna
          </a>
        </blockquote>
      </div>
    </div>
  )
}
