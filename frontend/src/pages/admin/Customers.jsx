import AdminLayout, { AdminTable } from "../../components/AdminLayout"

export default function Customers() {
  const customers = [
    ["Khristiane Cruz", "student@scentora.test", "0917 000 0000", "Oct 10, 2026"],
    ["Maria Santos", "maria@example.com", "0918 123 4567", "Oct 3, 2026"],
  ]

  return (
    <AdminLayout eyebrow="Optional MVP" title="Customers">
      <AdminTable columns={["Name", "Email", "Contact", "Date Joined", "Action"]}>
        {customers.map(([name, email, contact, joined]) => (
          <tr key={email} className="border-t border-border-faint">
            <td className="px-5 py-4 font-bold">{name}</td>
            <td className="px-5 py-4 text-muted">{email}</td>
            <td className="px-5 py-4 text-muted">{contact}</td>
            <td className="px-5 py-4 text-muted">{joined}</td>
            <td className="px-5 py-4"><button className="font-bold text-bronze">View order history</button></td>
          </tr>
        ))}
      </AdminTable>
    </AdminLayout>
  )
}
