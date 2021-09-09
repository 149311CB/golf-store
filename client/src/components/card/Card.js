import React from 'react'

const Card = ({ children }) => {
  return (
    <div className={"card"}>
      {children}
    </div>
  )
}

const Title = ({ children }) => {
  return (
    <div className={"card-title"}>{children}</div>
  )
}

const Body = ({ children }) => {
  return (
    <div className={"card-body option"}>{children}</div>
  )
}

const Text = () => {
  return (
    <div className={"card-text"}>Text</div>
  )
}

const Image = ({ src, alt }) => {
  return (
    <div className={"card-img"}>
      <img src={src} alt={alt} />
    </div>
  )
}

export { Card, Text, Image, Title, Body }

