import { useQuery, useQueryClient } from "@tanstack/react-query";
import { addObject, fetchObject } from "../api/object";
import { useMutation } from "@tanstack/react-query";

export const objectKeys = {
    all: ["object"],
    details: (id: string) => [...objectKeys.all, id],
};


export const useObject = () => {
    return useQuery({
        queryKey: objectKeys.all,
        queryFn: fetchObject,
    });
};

export const useAddObject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: addObject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: objectKeys.all });
        },
    });
};