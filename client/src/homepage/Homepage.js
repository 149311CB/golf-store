import React from 'react'
import { useFetch } from '../hooks/useFetch'
import Option from '../components/options/Option'
import OptionGroup from '../components/options/OptionGroup'
import { Card, Text, Image, Title, Body } from '../components/card/Card'

const products = "https://golf-company.herokuapp.com/api/golfs/";
const Home = () => {
  const { data, loading, error } = useFetch(products);

  if (error) {
    return null
  }
  return (
    <div className={"homepage"} style={{ paddingTop: "2.4rem", paddingLeft: "2.4rem" }}>
      {loading ? <div>loading...</div>
        :
        <div style={{ color: "white" }}>
          <Card>
            {/* <Title>Title</Title> */}
            <Body>
              <Image src={data[0].images[0]} />
              <Text></Text>
            </Body>
          </Card>
        </div>}
    </div>
  )
}

export default Home

