import React, { useEffect, useState } from "react";

export default function DataOutput() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);

  const [q, setQ] = useState("");
  const [searchParam] = useState(["gas_type", "name_address"]);
  const [filterParam, setFilterParam] = useState(["All"]);

  useEffect(() => {
    fetch("http://localhost:5000/gasInfo")
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setItems(result);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, []);

  function search(items) {
    return items.filter((item) => {
      if (item.gas_type == filterParam) {
        return searchParam.some((newItem) => {
          return (
            item[newItem].toString().toLowerCase().indexOf(q.toUpperCase()) > -1
          );
        });
      } else if (filterParam == "All") {
        return searchParam.some((newItem) => {
          return (
            item[newItem].toString().toLowerCase().indexOf(q.toLowerCase()) > -1
          );
        });
      }
    });
  }

  if (error) {
    return <>{error.message}</>;
  } else if (!isLoaded) {
    return <>loading...</>;
  } else {
    return (
      <div className="wrapper">
        <div className="form-group"></div>

        {/* Button Trigger modal */}
        <button
          type="button"
          class="btn btn-primary"
          data-toggle="modal"
          data-target="#dataTable"
        >
          View Data
        </button>

        {/* modal */}
        <div
          class="modal fade"
          id="dataTable"
          tabindex="-1"
          role="dialog"
          aria-labelledby="dataTable"
          aria-hidden="true"
        >
          <div class="modal-dialog mw-100" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="viewRawData">
                  Individual Gas Data
                </h5>
                <button
                  type="button"
                  class="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                {/* Data */}
                <h4>Search by Gas Type or Gas Station</h4>
                <label htmlFor="search-form">
                  <input
                    type="search"
                    name="search-form"
                    id="search-form"
                    className="form-control w-100"
                    placeholder="Search..."
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    // style={{ width: 500 }}
                  />
                  <span className="sr-only">
                    Search Gas Station or Gas Type here
                  </span>
                </label>
                <table className="table mt-5 text-center" id="dataTable">
                  <thead className="thead-dark">
                    <tr>
                      <th>ID</th>
                      <th>Date</th>
                      <th>Price</th>
                      <th>Type</th>
                      <th>Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {search(items).map((item) => (
                      <tr key={item.id} className="col-sm-auto">
                        <td>{item.id}</td>
                        <td>{item.date}</td>
                        <td>{item.gas_price}</td>
                        <td>{item.gas_type}</td>
                        <td>{item.name_address}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
