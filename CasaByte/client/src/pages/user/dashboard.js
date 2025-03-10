import { useEffect, useState } from "react";
import Sidebar from "../../components/nav/Sidebar";
import { useAuth } from "../../context/auth";
import axios from "axios";
import UserAdCard from "../../components/cards/UserAdCard";

export default function Dashboard() {
  const [auth, setAuth] = useAuth();

  const [ads, setAds] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const seller = auth.user?.role?.includes("Seller");

  useEffect(() => {
    fetchAds();
  }, [auth.token !== ""]);
  // if page state is > 1, run useEffect to fetch additional ads
  useEffect(() => {
    if (page === 1) return;
    // execute
    fetchAds();
  }, [page]);

  const fetchAds = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/user-ads/${page}`);
      setAds([...ads, ...data.ads]);
      setTotal(data.total);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <div>
      <div class="container" style={{padding: "2rem"}}>
        <div class="row">
          <div class="mx-auto">
            <h1 className="display-4 text-center" style={{ fontFamily: "Veranda" }}>
              Dashboard
            </h1>
            <Sidebar />
          </div>
        </div>
      </div>

      {!seller ? (
        <div
          className="d-flex justify-content-center align-items-center vh-100"
          style={{ marginTop: "-10%" }}
        >
          <h2>
            {" "}
            Hey {auth.user?.name ? auth.user?.name : auth.user?.username},
            Welcome to Real Estate
          </h2>
        </div>
      ) : (
        <div className="container">
          <div className="row">
            <div className="col-lg-8 offset-lg-2 mt-4 mb-4">
              <p className="text-center"> Total {total} ads found</p>
            </div>
          </div>
          <div className="row">
            {ads?.map((ad) => (
              <>
                <UserAdCard ad={ad} key={ad._id} />
              </>
            ))}
          </div>
          <div className="row">
            {ads && ads.length < total && (
              <div className="col text-center mt-4 mb-4">
                <button
                  disabled={loading}
                  className="btn btn-warning"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(page + 1);
                  }}
                >
                  {loading
                    ? "Loading..."
                    : `${ads?.length} / ${total} Load more`}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
