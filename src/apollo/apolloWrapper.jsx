"use client";
import setupAplloClient from "@/apollo/index";
import { ApolloProvider } from "@apollo/client";

const ApolloClientWrapper = ({ children }) => {
    const client = setupAplloClient();
    return (<>
        <ApolloProvider client={client}>
            {children}
        </ApolloProvider>
    </>);
};

export default ApolloClientWrapper;
