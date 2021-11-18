import React, { useState } from "react";
import { Button } from "antd";
import ReactExport from "react-data-export";
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

  const basedate = new Date(1899, 11, 30, 0, 0, 0);
  const dnthresh =
    basedate.getTime() +
    (new Date().getTimezoneOffset() - basedate.getTimezoneOffset()) * 60000;
  const day_ms = 24 * 60 * 60 * 1000;
  const days_1462_ms = 1462 * day_ms;

  function datenum(v, date1904) {
    let epoch = v.getTime();
    if (date1904) {
      epoch -= days_1462_ms;
    }
    return (epoch - dnthresh) / day_ms;
  }

  function fixImportedDate(date, is_date1904) {
    // This is to Convert JS Date back to Excel date code and parse them using THE SSF module.
    const parsed = XLSX.SSF.parse_date_code(datenum(date, false), {
      date1904: is_date1904,
    });
    return `${parsed.y}-${parsed.m}-${parsed.d}`;
  }

  const readMoMoExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = (e) => {
        const bufferArray = e.target.result;
        const wb = XLSX.readFile(bufferArray, {
          type: "buffer",
          cellDates: true,
        });
        const wsname = wb.SheetNames[1];
        const ws = wb.Sheets[wsname];
        const converted = XLSX.utils.sheet_to_json(ws, {
          header: 1,
          cellDates: true,
        });

        //Fix dates arror(it was substracting one from the orginal date)
        const is_date1904 = wb.Workbook.WBProps.date1904;
        const fixed = converted.map((arr) =>
          arr.map((v) => {
            if (v instanceof Date) {
              return fixImportedDate(v, is_date1904);
            } else {
              return v;
            }
          })
        );

        //convert an array of arrays into an array of objects
        const _fixed = fixed.map(
          ([
            Id,
            ExternalTransactionId,
            Date,
            Status,
            Type,
            ProviderCategory,
            Information,
            NoteMessage,
            From,
            FromName,
            FromHandlerName,
            To,
            ToName,
            ToHandlerName,
            InitiatedBy,
            OnBehalfOf,
            Amount,
            Currency1,
            ExternalAmount,
            Currency2,
            ExternalFXRate,
            ExternalServiceProvider,
            Fee,
            Currency3,
            Discount,
            Currency4,
            Promotion,
            Currency5,
            Coupon,
            Currency6,
            Balance,
            Currency,
          ]) => ({
            Id,
            ExternalTransactionId,
            Date,
            Status,
            Type,
            ProviderCategory,
            Information,
            NoteMessage,
            From,
            FromName,
            FromHandlerName,
            To,
            ToName,
            ToHandlerName,
            InitiatedBy,
            OnBehalfOf,
            Amount,
            Currency1,
            ExternalAmount,
            Currency2,
            ExternalFXRate,
            ExternalServiceProvider,
            Fee,
            Currency3,
            Discount,
            Currency4,
            Promotion,
            Currency5,
            Coupon,
            Currency6,
            Balance,
            Currency,
          })
        );
        resolve(_fixed);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then((data) => {
      const _data = data.filter((item) => item.Id !== "Id" && item.Id);
      setItems(_data);
    });
  };

  const readMoMoKayoveExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = (e) => {
        const bufferArray = e.target.result;
        const wb = XLSX.readFile(bufferArray, {
          type: "buffer",
          cellDates: true,
        });
        const wsname = wb.SheetNames[2];
        const ws = wb.Sheets[wsname];
        const converted = XLSX.utils.sheet_to_json(ws, {
          header: 1,
          cellDates: true,
        });

        //Fix dates arror(it was substracting one from the orginal date)
        const is_date1904 = wb.Workbook.WBProps.date1904;
        const fixed = converted.map((arr) =>
          arr.map((v) => {
            if (v instanceof Date) {
              return fixImportedDate(v, is_date1904);
            } else {
              return v;
            }
          })
        );

        //convert an array of arrays into an array of objects
        const _fixed = fixed.map(
          ([
            Id,
            ExternalTransactionId,
            Date,
            Status,
            Type,
            ProviderCategory,
            Information,
            NoteMessage,
            From,
            FromName,
            FromHandlerName,
            To,
            ToName,
            Amount,
            Fee,
            Currency1,
            Balance,
            Currency,
          ]) => ({
            Id,
            ExternalTransactionId,
            Date,
            Status,
            Type,
            ProviderCategory,
            Information,
            NoteMessage,
            From,
            FromName,
            FromHandlerName,
            To,
            ToName,
            Amount,
            Fee,
            Currency1,
            Balance,
            Currency,
          })
        );

        resolve(_fixed);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then((data) => {
      const _data = data.filter((item) => item.Id !== "Id" && item.Id);
      setItems(_data);
    });
  };

  const readInternalExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = (e) => {
        const bufferArray = e.target.result;
        const wb = XLSX.readFile(bufferArray, {
          type: "buffer",
          cellDates: true,
        });
        const wsname = wb.SheetNames[3];
        const ws = wb.Sheets[wsname];
        const converted = XLSX.utils.sheet_to_json(ws, {
          header: 1,
          cellDates: true,
        });

        //Fix dates arror(it was substracting one from the orginal date)
        const is_date1904 = wb.Workbook.WBProps.date1904;
        const fixed = converted.map((arr) =>
          arr.map((v) => {
            if (v instanceof Date) {
              return fixImportedDate(v, is_date1904);
            } else {
              return v;
            }
          })
        );

        //convert an array of arrays into an array of objects
        const _fixed = fixed.map(
          ([
            OrderDate,
            Depot,
            ClientNames,
            OrderValue,
            PaidAmount,
            UnpaidAmount,
            MoMoRef,
            PaidDate,
            TruckUsed,
            TINNumber,
            EBMProcessed,
          ]) => ({
            OrderDate,
            Depot,
            ClientNames,
            OrderValue,
            PaidAmount,
            UnpaidAmount,
            MoMoRef,
            PaidDate,
            TruckUsed,
            TINNumber,
            EBMProcessed,
          })
        );
        resolve(_fixed);
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
        const wb = XLSX.readFile(bufferArray, {
          type: "buffer",
          cellDates: true,
        });
        const wsname = wb.SheetNames[3];
        const ws = wb.Sheets[wsname];
        const converted = XLSX.utils.sheet_to_json(ws, {
          header: 1,
          cellDates: true,
        });

        //Fix dates arror(it was substracting one from the orginal date)
        const is_date1904 = wb.Workbook.WBProps.date1904;
        const fixed = converted.map((arr) =>
          arr.map((v) => {
            if (v instanceof Date) {
              return fixImportedDate(v, is_date1904);
            } else {
              return v;
            }
          })
        );

        //convert an array of arrays into an array of objects
        const _fixed = fixed.map(
          ([
            OrderDate,
            Depot,
            ClientNames,
            OrderValue,
            PaidAmount,
            UnpaidAmount,
            MoMoRef,
            PaidDate,
            TruckUsed,
            TINNumber,
            EBMProcessed,
          ]) => ({
            OrderDate,
            Depot,
            ClientNames,
            OrderValue,
            PaidAmount,
            UnpaidAmount,
            MoMoRef,
            PaidDate,
            TruckUsed,
            TINNumber,
            EBMProcessed,
          })
        );

        resolve(_fixed);
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
        return internalItem?.MoMoRef === item?.Id;
      });
    });
    setMatch(macthed);

    const theMacthedMOMO = items.filter((theItem) => {
      return internalItems.some((internalItem) => {
        return internalItem?.MoMoRef === theItem?.Id;
      });
    });
    setMacthedMOMO(theMacthedMOMO);

    const unmatched = internalItems.filter((internalItem) => {
      return !items.some((item) => {
        return internalItem?.MoMoRef === item?.Id;
      });
    });

    const _unmatched = unmatched.filter(
      (i) =>
        typeof i?.MoMoRef !== "string" &&
        i?.MoMoRef !== undefined &&
        i?.MoMoRef !== null &&
        i?.MoMoRef !== "" &&
        i?.MoMoRef !== "-" &&
        i?.MoMoRef !== " -"
    );
    setUnMatch(_unmatched);

    const theUnmatchedMOMO = items.filter((theItem) => {
      return !internalItems.some((internalItem) => {
        return internalItem?.MoMoRef === theItem?.Id;
      });
    });
    setUnmatchedMOMO(theUnmatchedMOMO);

    const theUnPaid = unmatched.filter(
      (i) =>
        typeof i?.MoMoRef !== "string" ||
        i?.MoMoRef === undefined ||
        i?.MoMoRef === null ||
        i?.MoMoRef === "" ||
        i?.MoMoRef === "-" ||
        i?.MoMoRef === " -"
    );
    setUnPaid(theUnPaid);

    const withTwo = unmatched.filter((i) => typeof i?.MoMoRef === "string");

    const splited = withTwo?.map((i) => {
      const split = i?.MoMoRef?.split(" ")?.join("");
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
                    <th scope="col">Type</th>
                    <th scope="col">From Name</th>
                    <th scope="col">To Name</th>
                    <th scope="col">Amount</th>
                    <th scope="col">Fee</th>
                    <th scope="col">Balance</th>
                    <th scope="col">Currency</th>
                  </tr>
                </thead>
                <tbody>
                  {match.length === 0
                    ? items.map((d) => (
                        <tr key={d?.Id}>
                          <th>{d?.Id}</th>
                          <th>{d?.ExternalTransactionId}</th>
                          <th>
                            {d?.Date === "-" ||
                            d?.Date === "" ||
                            d?.Date === " -"
                              ? "-"
                              : d?.Date}
                          </th>
                          <th>{d?.Status}</th>
                          <th>{d?.Type}</th>
                          <th>{d?.FromName}</th>
                          <th>{d?.ToName}</th>
                          <th>{d?.Amount && numberWithCommas(d?.Amount)}</th>
                          <th>{d?.Fee ? numberWithCommas(d?.Fee) : "-"}</th>
                          <th>
                            {d?.Balance ? numberWithCommas(d?.Balance) : "-"}
                          </th>
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
                        <tr key={d?.MoMoRef}>
                          <th>
                            {d?.OrderDate === "-" ||
                            d?.OrderDate === "" ||
                            d?.OrderDate === " -"
                              ? "-"
                              : d?.OrderDate}
                          </th>
                          <th>{d?.Depot}</th>
                          <th>{d?.ClientNames}</th>
                          <th>
                            {d?.OrderValue && numberWithCommas(d?.OrderValue)}
                          </th>
                          <th>
                            {d?.PaidAmount && numberWithCommas(d?.PaidAmount)}
                          </th>
                          <th>
                            {d?.UnpaidAmount &&
                              numberWithCommas(d?.UnpaidAmount)}
                          </th>
                          <th>{d?.MoMoRef}</th>

                          <th>
                            {d?.PaidDate === "-" ||
                            d?.PaidDate === "" ||
                            d?.PaidDate === " -"
                              ? "-"
                              : d?.PaidDate}
                          </th>
                          <th>{d?.TruckUsed}</th>
                          <th>{d?.TINNumber}</th>
                          <th>{d?.EBMProcessed}</th>
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
                      Download All results (Internal)
                    </Button>
                  }
                >
                  <ExcelSheet data={match} name="Matchs (Internal)">
                    <ExcelColumn label="Order Date" value="OrderDate" />
                    <ExcelColumn label="Depot" value="Depot" />
                    <ExcelColumn label="Client names" value="ClientNames" />
                    <ExcelColumn label="Order value" value="OrderValue" />
                    <ExcelColumn label="Paid Amount" value="PaidAmount" />
                    <ExcelColumn label="Unpaid Amount" value="UnpaidAmount" />
                    <ExcelColumn label="MoMo Ref" value="MoMoRef" />
                    <ExcelColumn label="Paid date" value="PaidDate" />
                    <ExcelColumn label="Truck used" value="TruckUsed" />
                    <ExcelColumn label="TIN Number" value="TINNumber" />
                    <ExcelColumn
                      label="EBM Processed: Yes/No"
                      value="EBMProcessed"
                    />
                    <ExcelColumn
                      label="Status"
                      value={(col) => (col?.MoMoRef ? "Match found" : null)}
                    />
                  </ExcelSheet>

                  <ExcelSheet data={unMatch} name="Fails (Internal)">
                    <ExcelColumn label="Order Date" value="OrderDate" />
                    <ExcelColumn label="Depot" value="Depot" />
                    <ExcelColumn label="Client names" value="ClientNames" />
                    <ExcelColumn label="Order value" value="OrderValue" />
                    <ExcelColumn label="Paid Amount" value="PaidAmount" />
                    <ExcelColumn label="Unpaid Amount" value="UnpaidAmount" />
                    <ExcelColumn label="MoMo Ref" value="MoMoRef" />
                    <ExcelColumn label="Paid date" value="PaidDate" />
                    <ExcelColumn label="Truck used" value="TruckUsed" />
                    <ExcelColumn label="TIN Number" value="TINNumber" />
                    <ExcelColumn
                      label="EBM Processed: Yes/No"
                      value="EBMProcessed"
                    />
                    <ExcelColumn
                      label="Status"
                      value={(col) => (col?.Depot ? "No match" : null)}
                    />
                  </ExcelSheet>

                  <ExcelSheet
                    data={unPaid}
                    name="Records with no ref ids(Internal)"
                  >
                    <ExcelColumn label="Order Date" value="OrderDate" />
                    <ExcelColumn label="Depot" value="Depot" />
                    <ExcelColumn label="Client names" value="ClientNames" />
                    <ExcelColumn label="Order value" value="OrderValue" />
                    <ExcelColumn label="Paid Amount" value="PaidAmount" />
                    <ExcelColumn label="Unpaid Amount" value="UnpaidAmount" />
                    <ExcelColumn label="MoMo Ref" value="MoMoRef" />
                    <ExcelColumn label="Paid date" value="PaidDate" />
                    <ExcelColumn label="Truck used" value="TruckUsed" />
                    <ExcelColumn label="TIN Number" value="TINNumber" />
                    <ExcelColumn
                      label="EBM Processed: Yes/No"
                      value="EBMProcessed"
                    />
                    <ExcelColumn
                      label="Status"
                      value={(col) =>
                        col?.Depot ? "Does not have ref id" : null
                      }
                    />
                  </ExcelSheet>
                </ExcelFile>
              </div>

              <div>
                <ExcelFile
                  element={
                    <Button>
                      <BiSpreadsheet />
                      Download successfull results
                    </Button>
                  }
                >
                  <ExcelSheet data={match} name="Matchs (Internals)">
                    <ExcelColumn label="Order Date" value="OrderDate" />
                    <ExcelColumn label="Depot" value="Depot" />
                    <ExcelColumn label="Client names" value="ClientNames" />
                    <ExcelColumn label="Order value" value="OrderValue" />
                    <ExcelColumn label="Paid Amount" value="PaidAmount" />
                    <ExcelColumn label="Unpaid Amount" value="UnpaidAmount" />
                    <ExcelColumn label="MoMo Ref" value="MoMoRef" />
                    <ExcelColumn label="Paid date" value="PaidDate" />
                    <ExcelColumn label="Truck used" value="TruckUsed" />
                    <ExcelColumn label="TIN Number" value="TINNumber" />
                    <ExcelColumn
                      label="EBM Processed: Yes/No"
                      value="EBMProcessed"
                    />
                    <ExcelColumn
                      label="Status"
                      value={(col) => (col?.MoMoRef ? "Match found" : null)}
                    />
                  </ExcelSheet>
                </ExcelFile>
              </div>

              <div>
                <ExcelFile
                  element={
                    <Button>
                      <BiSpreadsheet />
                      Download records with no refs
                    </Button>
                  }
                >
                  <ExcelSheet data={unPaid} name="Records with no refs">
                    <ExcelColumn label="Order Date" value="OrderDate" />
                    <ExcelColumn label="Depot" value="Depot" />
                    <ExcelColumn label="Client names" value="ClientNames" />
                    <ExcelColumn label="Order value" value="OrderValue" />
                    <ExcelColumn label="Paid Amount" value="PaidAmount" />
                    <ExcelColumn label="Unpaid Amount" value="UnpaidAmount" />
                    <ExcelColumn label="MoMo Ref" value="MoMoRef" />
                    <ExcelColumn label="Paid date" value="PaidDate" />
                    <ExcelColumn label="Truck used" value="TruckUsed" />
                    <ExcelColumn label="TIN Number" value="TINNumber" />
                    <ExcelColumn
                      label="EBM Processed: Yes/No"
                      value="EBMProcessed"
                    />
                    <ExcelColumn
                      label="Status"
                      value={(col) =>
                        col?.Depot ? "Does not have ref id" : null
                      }
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
                    <ExcelColumn label="Order Date" value="OrderDate" />
                    <ExcelColumn label="Depot" value="Depot" />
                    <ExcelColumn label="Client names" value="ClientNames" />
                    <ExcelColumn label="Order value" value="OrderValue" />
                    <ExcelColumn label="Paid Amount" value="PaidAmount" />
                    <ExcelColumn label="Unpaid Amount" value="UnpaidAmount" />
                    <ExcelColumn label="MoMo Ref" value="MoMoRef" />
                    <ExcelColumn label="Paid date" value="PaidDate" />
                    <ExcelColumn label="Truck used" value="TruckUsed" />
                    <ExcelColumn label="TIN Number" value="TINNumber" />
                    <ExcelColumn
                      label="EBM Processed: Yes/No"
                      value="EBMProcessed"
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
                    <tr key={d?.MoMoRef}>
                      <th>
                        {d?.OrderDate === "-" ||
                        d?.OrderDate === "" ||
                        d?.OrderDate === " -"
                          ? "-"
                          : d?.OrderDate}
                      </th>
                      <th>{d?.Depot}</th>
                      <th>{d?.ClientNames}</th>
                      <th>
                        {d?.OrderValue && numberWithCommas(d?.OrderValue)}
                      </th>
                      <th>
                        {d?.PaidAmount && numberWithCommas(d?.PaidAmount)}
                      </th>
                      <th>
                        {d?.UnpaidAmount && numberWithCommas(d?.UnpaidAmount)}
                      </th>
                      <th>{d?.MoMoRef}</th>

                      <th>
                        {d?.PaidDate === "-" ||
                        d?.PaidDate === "" ||
                        d?.PaidDate === " -"
                          ? "-"
                          : d?.PaidDate}
                      </th>
                      <th>{d?.TruckUsed}</th>
                      <th>{d?.TINNumber}</th>
                      <th>{d?.EBMProcessed}</th>
                      <th>
                        <BsCheckAll className="green" />
                      </th>
                    </tr>
                  ))}

                  {unMatch.map((d) => (
                    <tr key={d?.MoMoRef}>
                      <th>
                        {d?.OrderDate === "-" ||
                        d?.OrderDate === "" ||
                        d?.OrderDate === " -"
                          ? "-"
                          : d?.OrderDate}
                      </th>
                      <th>{d?.Depot}</th>
                      <th>{d?.ClientNames}</th>
                      <th>
                        {d?.OrderValue && numberWithCommas(d?.OrderValue)}
                      </th>
                      <th>
                        {d?.PaidAmount && numberWithCommas(d?.PaidAmount)}
                      </th>
                      <th>
                        {d?.UnpaidAmount && numberWithCommas(d?.UnpaidAmount)}
                      </th>
                      <th>{d?.MoMoRef}</th>

                      <th>
                        {d?.PaidDate === "-" ||
                        d?.PaidDate === "" ||
                        d?.PaidDate === " -"
                          ? "-"
                          : d?.PaidDate}
                      </th>
                      <th>{d?.TruckUsed}</th>
                      <th>{d?.TINNumber}</th>
                      <th>{d?.EBMProcessed}</th>
                      <th>
                        <VscError className="red" />
                      </th>
                    </tr>
                  ))}

                  {unPaid.map((d) => (
                    <tr key={d?.OrderDate}>
                      <th>
                        {d?.OrderDate === "-" ||
                        d?.OrderDate === "" ||
                        d?.OrderDate === " -"
                          ? "-"
                          : d?.OrderDate}
                      </th>
                      <th>{d?.Depot}</th>
                      <th>{d?.ClientNames}</th>
                      <th>
                        {d?.OrderValue && numberWithCommas(d?.OrderValue)}
                      </th>
                      <th>
                        {d?.PaidAmount && numberWithCommas(d?.PaidAmount)}
                      </th>
                      <th>
                        {d?.UnpaidAmount && numberWithCommas(d?.UnpaidAmount)}
                      </th>
                      <th>{d?.MoMoRef ? d?.MoMoRef : "-"}</th>

                      <th>
                        {d?.PaidDate === "-" ||
                        d?.PaidDate === "" ||
                        d?.PaidDate === " -"
                          ? "-"
                          : d?.PaidDate}
                      </th>
                      <th>{d?.TruckUsed}</th>
                      <th>{d?.TINNumber}</th>
                      <th>{d?.EBMProcessed}</th>
                      <th className="red">Has no ref id</th>
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
                            <th>{d?.ExternalTransactionId}</th>
                            <th>
                              {d?.Date === "-" ||
                              d?.Date === "" ||
                              d?.Date === " -"
                                ? "-"
                                : d?.Date}
                            </th>
                            <th>{d?.Status}</th>
                            <th>{d?.FromName}</th>
                            <th>{d?.ToName}</th>
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
                            <th>{d?.ExternalTransactionId}</th>
                            <th>
                              {d?.Date === "-" ||
                              d?.Date === "" ||
                              d?.Date === " -"
                                ? "-"
                                : d?.Date}
                            </th>
                            <th>{d?.Status}</th>
                            <th>{d?.FromName}</th>
                            <th>{d?.ToName}</th>
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
                      Download All results (MOMO)
                    </Button>
                  }
                >
                  <ExcelSheet data={macthedMOMO} name="Matchs (MOMO)">
                    <ExcelColumn label="ID" value="Id" />
                    <ExcelColumn
                      label="External Transaction Id"
                      value="ExternalTransactionId"
                    />
                    <ExcelColumn label="Date" value="Date" />
                    <ExcelColumn label="Status" value="Status" />
                    <ExcelColumn label="From Name" value="FromName" />
                    <ExcelColumn label="To Name" value="ToName" />
                    <ExcelColumn label="Amount" value="Amount" />
                    <ExcelColumn label="Fee" value="Fee" />
                    <ExcelColumn label="Balance" value="Balance" />
                    <ExcelColumn label="Currency" value="Currency" />
                    <ExcelColumn
                      label="Status"
                      value={(col) => (col?.Id ? "Match found" : null)}
                    />
                  </ExcelSheet>

                  <ExcelSheet data={unMatchedMOMO} name="Fails (MOMO)">
                    <ExcelColumn label="ID" value="Id" />
                    <ExcelColumn
                      label="External Transaction Id"
                      value="ExternalTransactionId"
                    />
                    <ExcelColumn label="Date" value="Date" />
                    <ExcelColumn label="Status" value="Status" />
                    <ExcelColumn label="From Name" value="FromName" />
                    <ExcelColumn label="To Name" value="ToName" />
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
                      value="ExternalTransactionId"
                    />
                    <ExcelColumn label="Date" value="Date" />
                    <ExcelColumn label="Status" value="Status" />
                    <ExcelColumn label="From Name" value="FromName" />
                    <ExcelColumn label="To Name" value="ToName" />
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
                      value="ExternalTransactionId"
                    />
                    <ExcelColumn label="Date" value="Date" />
                    <ExcelColumn label="Status" value="Status" />
                    <ExcelColumn label="From Name" value="FromName" />
                    <ExcelColumn label="To Name" value="ToName" />
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
                      <th>{d?.ExternalTransactionId}</th>
                      <th>
                        {d?.Date === "-" || d?.Date === "" || d?.Date === " -"
                          ? "-"
                          : d?.Date}
                      </th>
                      <th>{d?.Status}</th>
                      <th>{d?.FromName}</th>
                      <th>{d?.ToName}</th>
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
                      <th>{d?.ExternalTransactionId}</th>
                      <th>
                        {d?.Date === "-" || d?.Date === "" || d?.Date === " -"
                          ? "-"
                          : d?.Date}
                      </th>
                      <th>{d?.Status}</th>
                      <th>{d?.FromName}</th>
                      <th>{d?.ToName}</th>
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
