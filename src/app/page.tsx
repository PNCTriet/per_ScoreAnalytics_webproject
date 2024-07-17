import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    
      <ul>
        <li>
          <Link href={"/admin"}>admin side</Link>
        </li>
        <li>
        <Link href={"/user"}>user side</Link>
        </li>
      </ul>
    
  );
}
