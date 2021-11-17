import React, { useState } from "react";
import { Button } from "antd";
import ReactExport from "react-data-export";
import moment from "moment";
import * as XLSX from "xlsx";
import { BsCheckAll } from "react-icons/bs";
import { VscError } from "react-icons/vsc";
import { BiSpreadsheet } from "react-icons/bi";
import { numberWithCommas } from "../helpers/numbersFormatter";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const Home = () => {
  const [items, setItems] = useState([]);
  const [internalItems, setInternalItems] = useState([]);
  const [match, setMatch] = useState([]);
  const [macthedMOMO, setMacthedMOMO] = useState([]);
  const [unMatchedMOMO, setUnmatchedMOMO] = useState([]);
  const [unMatch, setUnMatch] = useState([]);
  const [unPaid, setUnPaid] = useState([]);
  const [splited, setSplited] = useState([]);
  const [manyRefData, setManyRefData] = useState([]);
  const [manyRefDataNotFound, setManyRefDataNotFound] = useState([]);
  const withManyRefs = [];
  const withManyRefsNotFount = [];

  const readMoMoExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = (e) => {
        const bufferArray = e.target.result;
        const wb = XLSX.read(bufferArray, { type: "buffer", cellDates: true });
        const wsname = wb.SheetNames[1];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        resolve(data);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then((data) => {
      const _data = data.filter((item) => item?.Id);
      setItems(_data);
    });
  };

  const readMoMoKayoveExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = (e) => {
        const bufferArray = e.target.result;
        const wb = XLSX.read(bufferArray, { type: "buffer", cellDates: true });
        const wsname = wb.SheetNames[2];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        resolve(data);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then((data) => {
      const _data = data.filter((item) => item.Id);
      setItems(_data);
    });
  };

  const readInternalExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = (e) => {
        const bufferArray = e.target.result;
        const wb = XLSX.read(bufferArray, { type: "buffer", cellDates: true });
        const wsname = wb.SheetNames[3];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        resolve(data);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then((data) => {
      const result = data.filter((item) => item.Depot === "Tyazo Depot");
      setInternalItems(result);
    });
  };

  const readInternalKayoveExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = (e) => {
        const bufferArray = e.target.result;
        const wb = XLSX.read(bufferArray, { type: "buffer", cellDates: true });
        const wsname = wb.SheetNames[3];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        resolve(data);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then((data) => {
      const result = data.filter((item) => item.Depot === "Kayove Depot");
      setInternalItems(result);
    });
  };

  const handleReconcile = () => {
    const macthed = internalItems.filter((internalItem) => {
      return items.some((item) => {
        return (
          internalItem["MoMo Ref"] && internalItem["MoMo Ref"] === item?.Id
        );
      });
    });
    setMatch(macthed);

    const theMacthedMOMO = items.filter((theItem) => {
      return internalItems.some((internalItem) => {
        return (
          internalItem["MoMo Ref"] && internalItem["MoMo Ref"] === theItem?.Id
        );
      });
    });
    setMacthedMOMO(theMacthedMOMO);

    const unmatched = internalItems.filter((internalItem) => {
      return !items.some((item) => {
        return (
          internalItem["MoMo Ref"] && internalItem["MoMo Ref"] === item?.Id
        );
      });
    });

    const _unmatched = unmatched.filter(
      (i) =>
        typeof i["MoMo Ref"] !== "string" &&
        i["MoMo Ref"] !== undefined &&
        i["MoMo Ref"] !== null &&
        i["MoMo Ref"] !== "" &&
        i["MoMo Ref"] !== "-" &&
        i["MoMo Ref"] !== " -"
    );
    setUnMatch(_unmatched);

    const theUnmatchedMOMO = items.filter((theItem) => {
      return !internalItems.some((internalItem) => {
        return (
          internalItem["MoMo Ref"] && internalItem["MoMo Ref"] === theItem?.Id
        );
      });
    });
    setUnmatchedMOMO(theUnmatchedMOMO);

    const theUnPaid = unmatched.filter(
      (i) =>
        typeof i["MoMo Ref"] !== "string" ||
        i["MoMo Ref"] === undefined ||
        i["MoMo Ref"] === null ||
        i["MoMo Ref"] === "" ||
        i["MoMo Ref"] === "-" ||
        i["MoMo Ref"] === " -"
    );
    setUnPaid(theUnPaid);

    const withTwo = unmatched.filter((i) => typeof i["MoMo Ref"] === "string");

    const splited = withTwo?.map((i) => {
      const split = i["MoMo Ref"]?.split(" ")?.join("");
      const _split = split.split(",");
      return _split;
    });

    setSplited(splited);

    splited.forEach((item) => {
      return item.forEach((item2) => {
        const found = items.find((theItems) => {
          return theItems?.Id === +item2;
        });
        if (found) {
          withManyRefs.push(found);
        } else {
          const notFound = items.find((theItems) => {
            return theItems?.Id !== +item2;
          });
          withManyRefsNotFount.push(notFound);
        }
      });
    });
    setManyRefData(withManyRefs);
    setManyRefDataNotFound(withManyRefsNotFount);
  };

  return (
    <>
      <div className="top_container">
        <Button type="primary" onClick={handleReconcile}>
          Reconcile
        </Button>
      </div>

      <div className="row">
        <div className="col-12">
          <h5 className="white">
            After doing the reconciliation one Depot, refresh the page to
            Reconcile an other!
          </h5>
        </div>
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
                        <tr key={d?.Id}>
                          <th>{d?.Id}</th>
                          <th>
                            {d["External Transaction Id"] &&
                              d["External Transaction Id"]}
                          </th>
                          <th>
                            {d?.Date === "-" ||
                            d?.Date === "" ||
                            d?.Date === " -"
                              ? "-"
                              : d?.Date && moment(d?.Date).format("LLL")}
                          </th>
                          <th>{d?.Status}</th>
                          <th>{d["From Name"] && d["From Name"]}</th>
                          <th>{d["To Name"] && d["To Name"]}</th>
                          <th>{d?.Amount && numberWithCommas(d?.Amount)}</th>
                          <th>{d?.Fee && numberWithCommas(d?.Fee)}</th>
                          <th>{d?.Balance && numberWithCommas(d?.Balance)}</th>
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
                          <th>
                            {d["Order Date"] === "-" ||
                            d["Order Date"] === "" ||
                            d["Order Date"] === " -"
                              ? "-"
                              : d["Order Date"] &&
                                moment(d["Order Date"]).format("LLL")}
                          </th>
                          <th>{d?.Depot}</th>
                          <th>{d["Client names"] && d["Client names"]}</th>
                          <th>
                            {d["Order value"] &&
                              numberWithCommas(d["Order value"])}
                          </th>
                          <th>
                            {d["Paid Amount"] &&
                              numberWithCommas(d["Paid Amount"])}
                          </th>
                          <th>
                            {d["Unpaid Amount"] &&
                              numberWithCommas(d["Unpaid Amount"])}
                          </th>
                          <th>{d["MoMo Ref"] && d["MoMo Ref"]}</th>

                          <th>
                            {d["Paid date"] === "-" ||
                            d["Paid date"] === "" ||
                            d["Paid date"] === " -"
                              ? "-"
                              : d["Paid date"] &&
                                moment(d["Paid date"]).format("LLL")}
                          </th>
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

        {/* Internal */}

        <div className="col-md-12 col-lg-12 col-12">
          <div className="report_container">
            <div className="head">
              <h6>Reconsile results (Internal)</h6>
              <div>
                <ExcelFile
                  element={
                    <Button>
                      <BiSpreadsheet />
                      Download successfull results (Internal)
                    </Button>
                  }
                >
                  <ExcelSheet data={match} name="Matchs (Internals)">
                    <ExcelColumn label="Order Date" value="Order Date" />
                    <ExcelColumn label="Depot" value="Depot" />
                    <ExcelColumn label="Client names" value="Client names" />
                    <ExcelColumn label="Order value" value="Order value" />
                    <ExcelColumn label="Paid Amount" value="Paid Amount" />
                    <ExcelColumn label="Unpaid Amount" value="Unpaid Amount" />
                    <ExcelColumn label="MoMo Ref" value="MoMo Ref" />
                    <ExcelColumn label="Paid date" value="Paid date" />
                    <ExcelColumn label="Truck used" value="Truck used" />
                    <ExcelColumn label="TIN Number" value="TIN Number" />
                    <ExcelColumn
                      label="EBM Processed: Yes/No"
                      value="EBM Processed: Yes/No"
                    />
                    <ExcelColumn
                      label="Status"
                      value={(col) => (col["MoMo Ref"] ? "Match found" : null)}
                    />
                  </ExcelSheet>
                </ExcelFile>
              </div>

              <div>
                <ExcelFile
                  element={
                    <Button>
                      <BiSpreadsheet />
                      Download unpaid records
                    </Button>
                  }
                >
                  <ExcelSheet data={unPaid} name="Unpaid records">
                    <ExcelColumn label="Order Date" value="Order Date" />
                    <ExcelColumn label="Depot" value="Depot" />
                    <ExcelColumn label="Client names" value="Client names" />
                    <ExcelColumn label="Order value" value="Order value" />
                    <ExcelColumn label="Paid Amount" value="Paid Amount" />
                    <ExcelColumn label="Unpaid Amount" value="Unpaid Amount" />
                    <ExcelColumn label="MoMo Ref" value="MoMo Ref" />
                    <ExcelColumn label="Paid date" value="Paid date" />
                    <ExcelColumn label="Truck used" value="Truck used" />
                    <ExcelColumn label="TIN Number" value="TIN Number" />
                    <ExcelColumn
                      label="EBM Processed: Yes/No"
                      value="EBM Processed: Yes/No"
                    />
                    <ExcelColumn
                      label="Status"
                      value={(col) => (col?.Depot ? "Not paid" : null)}
                    />
                  </ExcelSheet>
                </ExcelFile>
              </div>

              <div>
                <ExcelFile
                  element={
                    <Button>
                      <BiSpreadsheet />
                      Download Fails (Internal)
                    </Button>
                  }
                >
                  <ExcelSheet data={unMatch} name="Fails">
                    <ExcelColumn label="Order Date" value="Order Date" />
                    <ExcelColumn label="Depot" value="Depot" />
                    <ExcelColumn label="Client names" value="Client names" />
                    <ExcelColumn label="Order value" value="Order value" />
                    <ExcelColumn label="Paid Amount" value="Paid Amount" />
                    <ExcelColumn label="Unpaid Amount" value="Unpaid Amount" />
                    <ExcelColumn label="MoMo Ref" value="MoMo Ref" />
                    <ExcelColumn label="Paid date" value="Paid date" />
                    <ExcelColumn label="Truck used" value="Truck used" />
                    <ExcelColumn label="TIN Number" value="TIN Number" />
                    <ExcelColumn
                      label="EBM Processed: Yes/No"
                      value="EBM Processed: Yes/No"
                    />
                    <ExcelColumn
                      label="Status"
                      value={(col) => (col?.Depot ? "No match" : null)}
                    />
                  </ExcelSheet>
                </ExcelFile>
              </div>
              <div className="mb-5">
                <h5 className="white">
                  Total records ({internalItems.length})
                </h5>
                <h5 className="green">
                  Matchs: {match.length} + {splited.length} Ref IDs{" "}
                </h5>
                <h5 className="yellow">Not paid: {unPaid.length}</h5>

                <h5 className="red">Fails: {unMatch.length}</h5>
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
                    <tr key={d["MoMo Ref"] && d["MoMo Ref"]}>
                      <th>
                        {d["Order Date"] === "-" ||
                        d["Order Date"] === "" ||
                        d["Order Date"] === " -"
                          ? "-"
                          : d["Order Date"] &&
                            moment(d["Order Date"]).format("LLL")}
                      </th>
                      <th>{d?.Depot}</th>
                      <th>{d["Client names"] && d["Client names"]}</th>
                      <th>
                        {d["Order value"] && numberWithCommas(d["Order value"])}
                      </th>
                      <th>
                        {d["Paid Amount"] && numberWithCommas(d["Paid Amount"])}
                      </th>
                      <th>
                        {d["Unpaid Amount"] &&
                          numberWithCommas(d["Unpaid Amount"])}
                      </th>
                      <th>{d["MoMo Ref"] && d["MoMo Ref"]}</th>

                      <th>
                        {d["Paid date"] === "-" ||
                        d["Paid date"] === "" ||
                        d["Paid date"] === " -"
                          ? "-"
                          : d["Paid date"] &&
                            moment(d["Paid date"]).format("LLL")}
                      </th>
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
                      <th>
                        {d["Order Date"] === "-" ||
                        d["Order Date"] === "" ||
                        d["Order Date"] === " -"
                          ? "-"
                          : d["Order Date"] &&
                            moment(d["Order Date"]).format("LLL")}
                      </th>
                      <th>{d?.Depot}</th>
                      <th>{d["Client names"] && d["Client names"]}</th>
                      <th>
                        {d["Order value"] && numberWithCommas(d["Order value"])}
                      </th>
                      <th>
                        {d["Paid Amount"] && numberWithCommas(d["Paid Amount"])}
                      </th>
                      <th>
                        {d["Unpaid Amount"] &&
                          numberWithCommas(d["Unpaid Amount"])}
                      </th>
                      <th>{d["MoMo Ref"] && d["MoMo Ref"]}</th>

                      <th>
                        {d["Paid date"] === "-" ||
                        d["Paid date"] === "" ||
                        d["Paid date"] === " -"
                          ? "-"
                          : d["Paid date"] &&
                            moment(d["Paid date"]).format("LLL")}
                      </th>
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

                  {unPaid.map((d) => (
                    <tr key={d["MoMo Ref"] && d["Order Date"]}>
                      <th>
                        {d["Order Date"] === "-" ||
                        d["Order Date"] === "" ||
                        d["Order Date"] === " -"
                          ? "-"
                          : d["Order Date"] &&
                            moment(d["Order Date"]).format("LLL")}
                      </th>
                      <th>{d?.Depot}</th>
                      <th>{d["Client names"] && d["Client names"]}</th>
                      <th>
                        {d["Order value"] && numberWithCommas(d["Order value"])}
                      </th>
                      <th>
                        {d["Paid Amount"] && numberWithCommas(d["Paid Amount"])}
                      </th>
                      <th>
                        {d["Unpaid Amount"] &&
                          numberWithCommas(d["Unpaid Amount"])}
                      </th>
                      <th>{d["MoMo Ref"] && d["MoMo Ref"]}</th>

                      <th>
                        {d["Paid date"] === "-" ||
                        d["Paid date"] === "" ||
                        d["Paid date"] === " -"
                          ? "-"
                          : d["Paid date"] &&
                            moment(d["Paid date"]).format("LLL")}
                      </th>
                      <th>{d["Truck used"] && d["Truck used"]}</th>
                      <th>{d["TIN Number"] && d["TIN Number"]}</th>
                      <th>
                        {d["EBM Processed: Yes/No"] &&
                          d["EBM Processed: Yes/No"]}
                      </th>
                      <th className="red">Not paid</th>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {manyRefData.length !== 0 || manyRefDataNotFound.length !== 0 ? (
              <>
                <h6 className="white text-center">
                  Detected more than one ref IDs
                </h6>
                <div className="green_res_container">
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
                        <th scope="col">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {manyRefData.length !== 0 &&
                        manyRefData.map((d) => (
                          <tr key={d?.Id}>
                            <th>{d?.Id}</th>
                            <th>
                              {d["External Transaction Id"] &&
                                d["External Transaction Id"]}
                            </th>
                            <th>
                              {d?.Date === "-" ||
                              d?.Date === "" ||
                              d?.Date === " -"
                                ? "-"
                                : d?.Date && moment(d?.Date).format("LLL")}
                            </th>
                            <th>{d?.Status}</th>
                            <th>{d["From Name"] && d["From Name"]}</th>
                            <th>{d["To Name"] && d["To Name"]}</th>
                            <th>{d?.Amount && numberWithCommas(d?.Amount)}</th>
                            <th>{d?.Fee && numberWithCommas(d?.Fee)}</th>
                            <th>
                              {d?.Balance && numberWithCommas(d?.Balance)}
                            </th>
                            <th>{d?.Currency}</th>
                            <th>
                              <BsCheckAll className="green" />
                            </th>
                          </tr>
                        ))}

                      {manyRefDataNotFound.length !== 0 &&
                        manyRefDataNotFound.map((d) => (
                          <tr key={d?.Id}>
                            <th>{d?.Id}</th>
                            <th>
                              {d["External Transaction Id"] &&
                                d["External Transaction Id"]}
                            </th>
                            <th>
                              {d?.Date === "-" ||
                              d?.Date === "" ||
                              d?.Date === " -"
                                ? "-"
                                : d?.Date && moment(d?.Date).format("LLL")}
                            </th>
                            <th>{d?.Status}</th>
                            <th>{d["From Name"] && d["From Name"]}</th>
                            <th>{d["To Name"] && d["To Name"]}</th>
                            <th>{d?.Amount && numberWithCommas(d?.Amount)}</th>
                            <th>{d?.Fee && numberWithCommas(d?.Fee)}</th>
                            <th>
                              {d?.Balance && numberWithCommas(d?.Balance)}
                            </th>
                            <th>{d?.Currency}</th>
                            <th>
                              <VscError className="red" />
                            </th>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : null}
          </div>
        </div>

        {/* MoMo */}

        <div className="col-md-12 col-lg-12 col-12">
          <div className="report_container">
            <div className="head">
              <h6>Reconsile results (MOMO) </h6>
              <div>
                <ExcelFile
                  element={
                    <Button>
                      <BiSpreadsheet />
                      Download successfull results (MOMO)
                    </Button>
                  }
                >
                  <ExcelSheet data={macthedMOMO} name="Matchs (MOMO)">
                    <ExcelColumn label="ID" value="Id" />
                    <ExcelColumn
                      label="External Transaction Id"
                      value="External Transaction Id"
                    />
                    <ExcelColumn label="Date" value="Date" />
                    <ExcelColumn label="Status" value="Status" />
                    <ExcelColumn label="From Name" value="From Name" />
                    <ExcelColumn label="To Name" value="To Name" />
                    <ExcelColumn label="Amount" value="Amount" />
                    <ExcelColumn label="Fee" value="Fee" />
                    <ExcelColumn label="Balance" value="Balance" />
                    <ExcelColumn label="Currency" value="Currency" />
                    <ExcelColumn
                      label="Status"
                      value={(col) => (col?.Id ? "Match found" : null)}
                    />
                  </ExcelSheet>
                </ExcelFile>
              </div>

              <div>
                <ExcelFile
                  element={
                    <Button>
                      <BiSpreadsheet />
                      Download Fails (MOMO)
                    </Button>
                  }
                >
                  <ExcelSheet data={unMatchedMOMO} name="Fails (MOMO)">
                    <ExcelColumn label="ID" value="Id" />
                    <ExcelColumn
                      label="External Transaction Id"
                      value="External Transaction Id"
                    />
                    <ExcelColumn label="Date" value="Date" />
                    <ExcelColumn label="Status" value="Status" />
                    <ExcelColumn label="From Name" value="From Name" />
                    <ExcelColumn label="To Name" value="To Name" />
                    <ExcelColumn label="Amount" value="Amount" />
                    <ExcelColumn label="Fee" value="Fee" />
                    <ExcelColumn label="Balance" value="Balance" />
                    <ExcelColumn label="Currency" value="Currency" />
                    <ExcelColumn
                      label="Status"
                      value={(col) => (col?.Id ? "No match" : null)}
                    />
                  </ExcelSheet>
                </ExcelFile>
              </div>
              <div className="mb-5">
                <h5 className="white">Total records ({items.length})</h5>
                <h5 className="green">Matchs: {macthedMOMO.length}</h5>

                <h5 className="red">Fails: {unMatchedMOMO.length}</h5>
              </div>
            </div>

            <div className="green_res_container">
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
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {macthedMOMO.map((d) => (
                    <tr key={d?.Id}>
                      <th>{d?.Id}</th>
                      <th>
                        {d["External Transaction Id"] &&
                          d["External Transaction Id"]}
                      </th>
                      <th>
                        {d?.Date === "-" || d?.Date === "" || d?.Date === " -"
                          ? "-"
                          : d?.Date && moment(d?.Date).format("LLL")}
                      </th>
                      <th>{d?.Status}</th>
                      <th>{d["From Name"] && d["From Name"]}</th>
                      <th>{d["To Name"] && d["To Name"]}</th>
                      <th>{d?.Amount && numberWithCommas(d?.Amount)}</th>
                      <th>{d?.Fee && numberWithCommas(d?.Fee)}</th>
                      <th>{d?.Balance && numberWithCommas(d?.Balance)}</th>
                      <th>{d?.Currency}</th>
                      <th>
                        <BsCheckAll className="green" />
                      </th>
                    </tr>
                  ))}
                  {unMatchedMOMO.map((d) => (
                    <tr key={d?.Id}>
                      <th>{d?.Id}</th>
                      <th>
                        {d["External Transaction Id"] &&
                          d["External Transaction Id"]}
                      </th>
                      <th>
                        {d?.Date === "-" || d?.Date === "" || d?.Date === " -"
                          ? "-"
                          : d?.Date && moment(d?.Date).format("LLL")}
                      </th>
                      <th>{d?.Status}</th>
                      <th>{d["From Name"] && d["From Name"]}</th>
                      <th>{d["To Name"] && d["To Name"]}</th>
                      <th>{d?.Amount && numberWithCommas(d?.Amount)}</th>
                      <th>{d?.Fee && numberWithCommas(d?.Fee)}</th>
                      <th>{d?.Balance && numberWithCommas(d?.Balance)}</th>
                      <th>{d?.Currency}</th>
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
