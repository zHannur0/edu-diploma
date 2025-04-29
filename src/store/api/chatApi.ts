import {createApi} from "@reduxjs/toolkit/query/react";
import {Chat, ChatHistory, ChatMessage} from "@/types/Chat";
import baseQueryWithReauth from "@/store/api/baseQuery";

export const chatApi = createApi({
    reducerPath: "chatApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Chat"],
    endpoints: (builder) => ({
        getChatHistory: builder.query<ChatHistory, number>({
            query: (id) => ({
                url: `chats/${id}/history/`,
            }),
            providesTags: ["Chat"]
        }),
        getChat: builder.query<Chat[], void>({
            query: () => ({
                url: `chats/chats`,
            }),
            providesTags: ["Chat"]
        }),
        sendMessage: builder.mutation<ChatMessage, FormData>({
            query: (formData) => ({
                url: "chats/messages/",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["Chat"],
        }),
        deleteChat: builder.mutation<void, { id: number }>({
            query: ({id}) => ({
                url: `chats/${id}/delete_chats/`,
                method: "DELETE",
            }),
            invalidatesTags: ["Chat"]
        }),
    }),
});

export const { useGetChatHistoryQuery, useGetChatQuery, useSendMessageMutation, useDeleteChatMutation
} = chatApi;
