import { useEffect, useState } from "react";
import { useRedirect } from "../../hooks/useRedirect";
import { axiosReq } from "../../api/axiosDefaults";
import { useParams } from "react-router-dom";

const AdoptionRequest = () => {
  useRedirect("user");
  const { id } = useParams();

  const [adoption, setAdoption] = useState([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchAdoption = async () => {
      try {
        const { data } = await axiosReq.get("/adoption/" + id);
        console.log(data);
        setAdoption(data);
        setStatus(data.status);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAdoption();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axiosReq.put("/adoption/" + id, { status });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h1>Adoption Request for {adoption?.name}</h1>
      <table className="table-auto">
        <tbody>
          <tr>
            <th>Request From: </th>
            <td>{adoption?.username}</td>
          </tr>
          <tr>
            <th>Email: </th>
            <td>
              {adoption?.email ? (
                <span>{adoption.email}</span>
              ) : (
                <span>Not provided</span>
              )}
            </td>
          </tr>
          <tr>
            <th>Phone: </th>
            <td>
              {adoption?.phone ? (
                <span>{adoption.phone}</span>
              ) : (
                <span>Not provided</span>
              )}
            </td>
          </tr>
          <tr>
            <th>Message: </th>
            <td>{adoption?.message}</td>
          </tr>
          <tr>
            <th>Status: </th>
            <td>{adoption?.status}</td>
          </tr>
          <tr></tr>
        </tbody>
      </table>
      <div>
        <h2>Update Adoption Request: </h2>
        <form onSubmit={handleSubmit}>
          <label>Status</label>
          <select onChange={(e) => setStatus(e.target.value)}>
            <option value="Submitted">Submitted</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
          <button type="submit">Update</button>
        </form>
      </div>
    </div>
  );
};

export default AdoptionRequest;
