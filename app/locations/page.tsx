import { prisma } from "@/lib/prisma";
import LocationForm from "@/components/LocationForm";
import { requireUser } from "@/lib/authcheck";
export default async function LocationPage(){
    // 1. ログイン確認
    const user = await requireUser();
    //2. 自分の観測地だけ取る
    const Locations = await prisma.location.findMany({
        where:{userId:user.id}
    });
    // 3. map で表示する
    return (
        <div>
            <h1>観測地</h1>
            {Locations.length === 0 && <p>まだ観測地がありません</p>}
            <div>
                {Locations.map((l) => (
                    <div key={l.id}>
                        <p>{l.name}</p>
                        <p>{l.lat}</p>
                        <p>{l.lng}</p>
                    </div>
                ))}
            </div>
            <div>
                <h2>観測地の追加</h2>
                <LocationForm />
            </div>
        </div>
    );
    
}