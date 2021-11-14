import React, { useState } from "react";
import { Button } from "antd";
import * as XLSX from "xlsx";
import { BsCheckAll } from "react-icons/bs";
import { VscError } from "react-icons/vsc";

const Home = () => {
  const [items, setItems] = useState([]);
  const [internalItems, setInternalItems] = useState([]);
  const [match, setMatch] = useState([]);
  const [unMatch, setUnMatch] = useState([]);

  const readMoMoExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;

        const wb = XLSX.read(bufferArray, { type: "buffer" });

        const wsname = wb.SheetNames[0];

        const ws = wb.Sheets[wsname];

        const data = XLSX.utils.sheet_to_json(ws);

        resolve(data);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then((d) => {
      setItems(d);
    });
  };

  const readMoMoKayoveExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;

        const wb = XLSX.read(bufferArray, { type: "buffer" });

        const wsname = wb.SheetNames[1];

        const ws = wb.Sheets[wsname];

        const data = XLSX.utils.sheet_to_json(ws);

        resolve(data);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then((d) => {
      setItems(d);
    });
  };

  const readInternalExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;

        const wb = XLSX.read(bufferArray, { type: "buffer" });

        const wsname = wb.SheetNames[2];

        const ws = wb.Sheets[wsname];

        const data = XLSX.utils.sheet_to_json(ws);

        resolve(data);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then((d) => {
      const result = d.filter((item) => item.Depot === "Tyazo Depot");
      setInternalItems(result);
      console.log("$$$$$$$$$$", result);
    });
  };

  const readInternalKayoveExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;

        const wb = XLSX.read(bufferArray, { type: "buffer" });

        const wsname = wb.SheetNames[2];

        const ws = wb.Sheets[wsname];

        const data = XLSX.utils.sheet_to_json(ws);

        resolve(data);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then((d) => {
      const result = d.filter((item) => item.Depot === "Kayove Depot");
      setInternalItems(result);
      console.log("$$$$$$$$$$", result);
    });
  };

  const handleClick = () => {
    const res = internalItems.filter(function (internalItem) {
      return items.some(function (item) {
        return (
          internalItem["MoMo Ref"] && internalItem["MoMo Ref"] === item?.Id
        );
      });
    });
    setMatch(res);

    var result = internalItems.filter(function (internalItem) {
      return !items.some(function (item) {
        return (
          internalItem["MoMo Ref"] && internalItem["MoMo Ref"] === item?.Id
        );
      });
    });

    setUnMatch(result);
  };

  console.log("all", internalItems.length);
  console.log("match", match.length);
  console.log("unmActh", unMatch.length);
  console.log("unmActh", unMatch);
  return (
    <>
      <div className="top_container">
        <Button type="primary" onClick={handleClick}>
          Reconcile
        </Button>
      </div>

      <div className="row">
        <div className="col-md-12 col-lg-12 col-12">
          <div className="report_container">
            <div className="head">
              <div>
                <input
                  type="file"
                  placeholder="Upload MoMo Report"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    readMoMoExcel(file);
                  }}
                />
                <h6>MoMo Tyzo REPORT</h6>
              </div>

              <div>
                <input
                  type="file"
                  placeholder="Upload MoMo Report"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    readMoMoKayoveExcel(file);
                  }}
                />
                <h6>MoMo Kayove REPORT</h6>
              </div>
            </div>

            <div className="momo_report_container">
              <table className="table container">
                <thead>
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">External Transaction Id</th>
                    <th scope="col">Date</th>
                    <th scope="col">Status</th>
                    <th scope="col">From Name</th>
                    <th scope="col">To Name</th>
                    <th scope="col">Amount</th>
                    <th scope="col">Fee</th>
                    <th scope="col">Balance</th>
                    <th scope="col">Currency</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  {match.length === 0
                    ? items.map((d) => (
                        <tr key={d?.Date}>
                          <th>{d?.Id}</th>
                          <th>
                            {d["External Transaction Id"] &&
                              d["External Transaction Id"]}
                          </th>
                          <th>{d?.Date}</th>
                          <th>{d?.Status}</th>
                          <th>{d["From Name"] && d["From Name"]}</th>
                          <th>{d["To Name"] && d["To Name"]}</th>
                          <th>{d?.Amount}</th>
                          <th>{d?.Fee}</th>
                          <th>{d?.Balance}</th>
                          <th>{d?.Currency}</th>
                        </tr>
                      ))
                    : null}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-md-12 col-lg-12 col-12">
          <div className="report_container">
            <div className="head">
              <div>
                <input
                  className="mb-2 mt-2"
                  type="file"
                  placeholder="Upload Internal Report"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    readInternalExcel(file);
                  }}
                />
                <h6>Internal REPORT (Tyazo)</h6>
              </div>

              <div>
                <input
                  className="mb-2 mt-2"
                  type="file"
                  placeholder="Upload Internal Report"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    readInternalKayoveExcel(file);
                  }}
                />
                <h6>Internal REPORT (Kayove Depot)</h6>
              </div>
            </div>
            <div className="our_report_container">
              <table className="table container">
                <thead>
                  <tr>
                    <th scope="col">Order Date</th>
                    <th scope="col">Depot</th>
                    <th scope="col">Client names</th>
                    <th scope="col">Order value</th>
                    <th scope="col">Paid Amount</th>
                    <th scope="col">Unpaid Amount</th>
                    <th scope="col">MoMo Ref</th>
                    <th scope="col">Paid date</th>
                    <th scope="col">Truck used</th>
                    <th scope="col">TIN Number</th>
                    <th scope="col">EBM Processed: Yes/No</th>
                  </tr>
                </thead>
                <tbody>
                  {match.length === 0
                    ? internalItems.map((d) => (
                        <tr key={d["MoMo Ref"] && d["MoMo Ref"]}>
                          <th>{d["Order Date"] && d["Order Date"]}</th>
                          <th>{d?.Depot}</th>
                          <th>{d["Client names"] && d["Client names"]}</th>
                          <th>{d["Order value"] && d["Order value"]}</th>
                          <th>{d["Paid Amount"] && d["Paid Amount"]}</th>
                          <th>{d["Unpaid Amount"] && d["Unpaid Amount"]}</th>
                          <th>{d["MoMo Ref"] && d["MoMo Ref"]}</th>
                          <th>{d["Paid date"] && d["Paid date"]}</th>
                          <th>{d["Truck used"] && d["Truck used"]}</th>
                          <th>{d["TIN Number"] && d["TIN Number"]}</th>
                          <th>
                            {d["EBM Processed: Yes/No"] &&
                              d["EBM Processed: Yes/No"]}
                          </th>
                        </tr>
                      ))
                    : null}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-md-12 col-lg-12 col-12">
          <div className="report_container">
            <div className="head">
              <h6>Reconsile results</h6>
              <div>
                <h5 className="green">Matchs: {match.length} </h5>
                <h5 className="red">UnMatchs: {unMatch.length} </h5>
              </div>
            </div>
            <div className="green_res_container">
              <table className="table container">
                <thead>
                  <tr>
                    <th scope="col">Order Date</th>
                    <th scope="col">Depot</th>
                    <th scope="col">Client names</th>
                    <th scope="col">Order value</th>
                    <th scope="col">Paid Amount</th>
                    <th scope="col">Unpaid Amount</th>
                    <th scope="col">MoMo Ref</th>
                    <th scope="col">Paid date</th>
                    <th scope="col">Truck used</th>
                    <th scope="col">TIN Number</th>
                    <th scope="col">EBM Processed: Yes/No</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {match.map((d) => (
                    <tr key={d["MoMo Ref"] && d["Order Date"]}>
                      <th>{d["Order Date"] && d["Order Date"]}</th>
                      <th>{d?.Depot}</th>
                      <th>{d["Client names"] && d["Client names"]}</th>
                      <th>{d["Order value"] && d["Order value"]}</th>
                      <th>{d["Paid Amount"] && d["Paid Amount"]}</th>
                      <th>{d["Unpaid Amount"] && d["Unpaid Amount"]}</th>
                      <th>{d["MoMo Ref"] && d["MoMo Ref"]}</th>
                      <th>{d["Paid date"] && d["Paid date"]}</th>
                      <th>{d["Truck used"] && d["Truck used"]}</th>
                      <th>{d["TIN Number"] && d["TIN Number"]}</th>
                      <th>
                        {d["EBM Processed: Yes/No"] &&
                          d["EBM Processed: Yes/No"]}
                      </th>
                      <th>
                        <BsCheckAll className="green" />
                      </th>
                    </tr>
                  ))}

                  {unMatch.map((d) => (
                    <tr key={d["MoMo Ref"] && d["Order Date"]}>
                      <th>{d["Order Date"] && d["Order Date"]}</th>
                      <th>{d?.Depot}</th>
                      <th>{d["Client names"] && d["Client names"]}</th>
                      <th>{d["Order value"] && d["Order value"]}</th>
                      <th>{d["Paid Amount"] && d["Paid Amount"]}</th>
                      <th>{d["Unpaid Amount"] && d["Unpaid Amount"]}</th>
                      <th>{d["MoMo Ref"] && d["MoMo Ref"]}</th>
                      <th>{d["Paid date"] && d["Paid date"]}</th>
                      <th>{d["Truck used"] && d["Truck used"]}</th>
                      <th>{d["TIN Number"] && d["TIN Number"]}</th>
                      <th>
                        {d["EBM Processed: Yes/No"] &&
                          d["EBM Processed: Yes/No"]}
                      </th>
                      <th>
                        <VscError className="red" />
                      </th>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
