import { useEffect, useReducer, useState, useContext, useRef } from "react";
import { UserContext } from "../../../contexts/userContext";
import { isAuthenticated } from "../../../services/auth";
import Loader from "react-loader-spinner";
import {
  createRequest,
  deleteRequest,
  getRequesetsByUser,
} from "../../../services/requests";
import { format } from "date-fns";
import { CSSTransition } from "react-transition-group";
import { RequestsList } from "./RequestsList";
import { RequestsCards } from "./RequestsCards";
import { Spinner } from "../../../components/Spinner";
import { NewRequest } from "./NewRequest";

export default function UserRequests() {
  const { verifiedUser } = useContext(UserContext);

  const reducer = (state, action) => {
    switch (action.type) {
      case "SET_ANY":
        return { ...state, ...action.payload };
      case "TOGGLE_NEW_REQUEST":
        return {
          ...state,
          showNewRequest: !state.showNewRequest,
        };
      case "TOGGLE_IS_DELETING":
        return { ...state, isDeleting: !state.isDeleting };
      default:
        return initialState;
    }
  };

  const initialState = {
    isLoading: true,
    showNewRequest: false,
    numOfDateInputs: 1,
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const handleDeleteRequest = async (r_id) => {
    const doDelete = window.confirm("Delete request?");
    if (doDelete) {
      dispatch({ type: "TOGGLE_IS_DELETING" });
      const tokenConfig = isAuthenticated();

      // Delete request and refresh list
      await deleteRequest(r_id, tokenConfig);
      const requests = await getRequesetsByUser(verifiedUser.u_id);
      dispatch({
        type: "SET_ANY",
        payload: {
          requests,
          isDeleting: false,
        },
      });
    }
  };

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      if (verifiedUser) {
        const requests = await getRequesetsByUser(verifiedUser.u_id);

        if (isMounted) {
          dispatch({
            type: "SET_ANY",
            payload: {
              requests,
              isLoading: false,
            },
          });
        }
      }
    }

    fetchData();

    return () => (isMounted = false);
  }, [verifiedUser]);

  return (
    <div className="requests-container relative">
      {state.isLoading ? (
        <Spinner />
      ) : (
        <div className="w-100">
          <NewRequest
            state={state}
            dispatch={dispatch}
            verifiedUser={verifiedUser}
          />
          <div className="my-3 text-center">
            <button
              className="btn-lg btn-hovered"
              onClick={() => dispatch({ type: "TOGGLE_NEW_REQUEST" })}
            >
              <p>New Request</p>
            </button>
          </div>
          <div className="mt-5">
            {/* {renderRequests()} */}
            <RequestsList
              state={state}
              handleDeleteRequest={handleDeleteRequest}
            />
            {/* {renderRequestsCards()} */}
            <RequestsCards
              state={state}
              handleDeleteRequest={handleDeleteRequest}
            />
          </div>
        </div>
      )}
    </div>
  );
}
