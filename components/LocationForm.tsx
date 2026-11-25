"use client";
import { useActionState} from "react";
import createLocation from "@/actions/createLocation";

type State = {success?:boolean,error?:string}
export default  function LocationForm(){
    const [state,formaction] = useActionState(
        async(_:State|null,formData:FormData) => {
            return await createLocation(formData)
        },null
    );
    
    return(
        <div>
            <h1>観測地の入力</h1>
            <form action={formaction}>
                <label htmlFor="name">観測地名</label>
                <input type="text" id="name" name="name" placeholder="例)長崎展望台"/>
                <label htmlFor="lat">緯度</label>
                <input type="number" step="any" id="lat" name="lat" placeholder="例)35.6812(-90〜90)" />
                <label htmlFor="lng">経度</label>
                <input type="number" step="any" id="lng" name="lng" placeholder="例)139.7671(-180〜180)" />
                {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}
                <button type="submit">追加</button>
            </form>
        </div>
    )
    
}