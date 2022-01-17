import React, { useContext, useEffect, useRef, useState } from "react";
import { GlobalContext } from "../../App";
import Button from "../../components/button/Button";
import LabelWrapper from "../../components/form/LabelWrapper";
import Modal from "../../components/modal/Modal";
import { client } from "../../utils/client";

const Address: React.FC<{
  shipping: any;
  setShipping: (current: any) => void;
  setDisabled: (current: boolean) => void;
}> = ({ shipping, setShipping, setDisabled }) => {
  const { token } = useContext(GlobalContext);
  const [isOpen, setIsOpen] = useState(false);
  const street = useRef<HTMLInputElement>(null);
  const city = useRef<HTMLInputElement>(null);
  const state = useRef<HTMLInputElement>(null);
  const apt = useRef<HTMLInputElement>(null);
  const zip = useRef<HTMLInputElement>(null);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { data, status } = await client.post(
      "/api/address/user/create",
      {
        street: street.current?.value,
        city: city.current?.value,
        state: state.current?.value,
        apt: apt.current?.value,
        zip: zip.current?.value,
      },
      { credentials: "include", headers: { authorization: `Bearer ${token}` } }
    );
    if (status === 201) {
      setIsOpen(false);
      setShipping(data);
    }
  };
  useEffect(() => {
    if (token && token !== "-1") {
      const fetchData = async () => {
        const { data } = await client.get("/api/address/user/primary", {
          credentials: "include",
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        setShipping(data.data);
      };
      fetchData();
    }
  }, [token, setShipping]);

  useEffect(() => {
    if (!shipping) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [shipping, setDisabled]);

  if (!shipping) {
    return (
      <div>
        <div style={{ paddingBottom: "0.6rem" }}>
          <span style={{ marginRight: "1ch" }}>
            <i className="fas fa-map-marker-alt"></i>
          </span>
          You have no primary address
        </div>
        <Button
          className={"add-address-btn"}
          border={"border"}
          style={{ width: "100%" }}
          onClick={() => {
            setIsOpen(true);
          }}
        >
          Add one now
        </Button>
        <Modal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          styles={{
            backgroundColor: "hsl(0, 0%, 26%)",
            padding: "1.2rem",
            borderRadius: "0.3rem",
            width: "30%",
          }}
        >
          <form id={"add-address-form"} onSubmit={(e) => submitHandler(e)}>
            <LabelWrapper name={"Street Address"} required>
              <input className={"standout box-shadow-small"} ref={street} />
            </LabelWrapper>
            <LabelWrapper name={"Apt, Suite, etc."}>
              <input className={"standout box-shadow-small"} ref={apt} />
            </LabelWrapper>
            <LabelWrapper name={"Zip Code"} required>
              <input
                className={"standout box-shadow-small"}
                type="number"
                min={0}
                ref={zip}
              />
            </LabelWrapper>
            <LabelWrapper name={"City"} required>
              <input className={"standout box-shadow-small"} ref={city} />
            </LabelWrapper>
            <LabelWrapper name={"State"} required>
              <input className={"standout box-shadow-small"} ref={state} />
            </LabelWrapper>
            <Button className={"secondary"}>Confirm</Button>
          </form>
        </Modal>
      </div>
    );
  }
  return (
    <div>
      <p>
        <strong>Shipping Address: </strong>
        {shipping.apt && shipping.apt + ","} {shipping.street}, {shipping.city},{" "}
        {shipping.state}, {shipping.zip}
      </p>
      <Button
        className={"add-address-btn"}
        border={"border"}
        style={{ width: "100%", marginTop: "0.6rem", color: "white" }}
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Change address
      </Button>
    </div>
  );
};

export default Address;
