import React from "react";
import { Table } from "react-bootstrap";

export default props => {
  return (
    <div style={{ width: "800px" }}>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Id</th>
            <th>Message</th>
            <th>Level</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          {props.events.map(event => (
            <tr>
              <td onClick={evt => copyToClipBoard(evt.target.innerHTML)}>
                {event.id}
              </td>
              <td>{event.message}</td>
              <td>{event.level}</td>
              <td>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Id</th>
                      <th>Environnement</th>
                      <th>Service</th>
                    </tr>
                  </thead>
                  <tbody>
                    {event.data.map(data => (
                      <tr>
                        <td
                          onClick={evt => copyToClipBoard(evt.target.innerHTML)}
                        >
                          {data.id}
                        </td>
                        <td>{data.environnement}</td>
                        <td>{data.service}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

const copyToClipBoard = value => {
  var el = document.createElement("textarea");
  el.value = value;
  el.setAttribute("readonly", "");
  el.style = { position: "absolute", left: "-9999px" };
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
};
