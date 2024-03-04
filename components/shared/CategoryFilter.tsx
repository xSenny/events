'use client';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {useEffect, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {formUrlQuery, removeKeysFromQuery} from "@/lib/utils";
import {getAllCategories} from "@/lib/actions/category.actions";
import {ICategory} from "@/lib/database/models/category.model";

const CategoryFilter = () => {

    const [categories, setCategories] = useState<ICategory[]>([])
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const getCategories = async () => {
            const categories = await getAllCategories();
            categories && setCategories(categories as ICategory[]);
        }
        getCategories();
    }, [])

    const onSelectCategory = (category: string) => {
        let newUrl = '';
        if (category && category !== 'All') {
            newUrl = formUrlQuery({
                params: searchParams.toString(),
                key: 'category',
                value: category,
            })
        } else {
            newUrl = removeKeysFromQuery({
                params: searchParams.toString(),
                keysToRemove: ['category']
            })
        }
        router.push(newUrl, {scroll: false})
    }

    return (
        <Select onValueChange={(e: string) => onSelectCategory(e)}>
            <SelectTrigger className="select-field">
                <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="All" className={"select-item p-regular-14"}>All</SelectItem>
                {categories.length > 0 && categories.map((category) => (
                    <SelectItem key={category._id} value={category.name} className={"select-item p-regular-14"}>{category.name}</SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

export default CategoryFilter;